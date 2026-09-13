-- ═══════════════════════════════════════════════════════════════════════════════
-- COMMISSION PORTAL — DATABASE MIGRATION
-- Alexandra Pintea · alexandrapintea.art
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- AFTER RUNNING THIS SQL, also create the storage bucket:
--   Supabase Dashboard → Storage → New bucket
--   Name:   commission-documents
--   Public: OFF  (private — no public URLs)
-- ═══════════════════════════════════════════════════════════════════════════════

BEGIN;

-- ── 1. PORTAL CLIENTS ─────────────────────────────────────────────────────────
-- Root of the ownership chain. One row per commission client.
-- Completely independent of Print Club subscriptions.
-- auth_user_id is NULL until the client first logs in (linked by email match).
CREATE TABLE IF NOT EXISTS portal_clients (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id  uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ── 2. COMMISSIONS ────────────────────────────────────────────────────────────
-- Created by admin only. Never by clients.
-- enquiry_id links back to the source commission_enquiries row.
CREATE TABLE IF NOT EXISTS commissions (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference            text UNIQUE NOT NULL,          -- e.g. AP-2026-001
  client_id            uuid NOT NULL REFERENCES portal_clients(id),
  enquiry_id           uuid UNIQUE REFERENCES commission_enquiries(id),
  artwork_title        text NOT NULL,
  description          text,
  medium               text,
  dimensions           text,
  agreed_price_gbp     numeric(10,2),
  currency             text NOT NULL DEFAULT 'gbp',
  deposit_amount_gbp   numeric(10,2),
  status               text NOT NULL DEFAULT 'agreement_pending',
  -- agreement_pending | agreement_signed | deposit_pending | deposit_paid
  -- concept | concept_review | concept_approved | production
  -- final_review | final_payment_pending | final_payment_paid
  -- completed | shipping | delivered | archived
  estimated_completion date,
  admin_notes          text,   -- ← NEVER returned to clients. Ever.
  invitation_sent_at   timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

-- ── 3. LINK ENQUIRIES → COMMISSIONS ──────────────────────────────────────────
-- One enquiry can become at most one commission (UNIQUE enforces this).
ALTER TABLE commission_enquiries
  ADD COLUMN IF NOT EXISTS commission_id uuid UNIQUE REFERENCES commissions(id);

-- ── 4. COMMISSION TIMELINE ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commission_timeline (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  stage         text NOT NULL,
  -- consultation | agreement | deposit | concept | production | final_review | delivery
  stage_order   int  NOT NULL,
  status        text NOT NULL DEFAULT 'upcoming',
  -- upcoming | active | completed
  completed_at  timestamptz,
  client_note   text,    -- shown to client
  admin_note    text,    -- NEVER shown to client
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ── 5. COMMISSION UPDATES ─────────────────────────────────────────────────────
-- Messages from admin. is_client_visible = false rows are invisible to clients at RLS level.
CREATE TABLE IF NOT EXISTS commission_updates (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id     uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  title             text,
  body              text NOT NULL,
  is_client_visible bool NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- ── 6. COMMISSION DOCUMENTS ───────────────────────────────────────────────────
-- Metadata only. Files live in the private commission-documents storage bucket.
-- is_client_visible = false means the row is invisible to clients at RLS level.
CREATE TABLE IF NOT EXISTS commission_documents (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id     uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  document_type     text NOT NULL,
  -- agreement | invoice | receipt | certificate | care_guide | concept | final_artwork | shipping | other
  label             text NOT NULL,
  storage_path      text NOT NULL,   -- path inside commission-documents bucket
  file_size_bytes   bigint,
  mime_type         text,
  is_client_visible bool NOT NULL DEFAULT true,
  uploaded_at       timestamptz NOT NULL DEFAULT now()
);

-- ── 7. CONCEPT VERSIONS ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS concept_versions (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id  uuid NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
  version_number int  NOT NULL,
  label          text,              -- e.g. "Concept v2"
  storage_path   text NOT NULL,
  notes          text,              -- shown to client
  admin_notes    text,              -- NEVER shown to client
  status         text NOT NULL DEFAULT 'pending',
  -- pending | approved | changes_requested | superseded
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (commission_id, version_number)
);

-- ── 8. CONCEPT APPROVALS (append-only) ───────────────────────────────────────
-- Records exactly what was approved/rejected and by whom.
-- No updated_at — this record must never be mutated.
CREATE TABLE IF NOT EXISTS concept_approvals (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  concept_version_id uuid NOT NULL REFERENCES concept_versions(id),
  commission_id      uuid NOT NULL REFERENCES commissions(id),
  client_id          uuid NOT NULL REFERENCES portal_clients(id),
  auth_user_id       uuid NOT NULL,   -- snapshot of auth.uid() at action time
  action             text NOT NULL,   -- approved | changes_requested
  changes_note       text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- ── 9. COMMISSION PAYMENTS ────────────────────────────────────────────────────
-- Status is set by verified Stripe webhook ONLY. Never by frontend or client.
CREATE TABLE IF NOT EXISTS commission_payments (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id               uuid NOT NULL REFERENCES commissions(id),
  client_id                   uuid NOT NULL REFERENCES portal_clients(id),
  payment_type                text NOT NULL,   -- deposit | final_payment | other
  amount_gbp                  numeric(10,2) NOT NULL,
  currency                    text NOT NULL DEFAULT 'gbp',
  stripe_checkout_session_id  text UNIQUE,
  stripe_payment_intent_id    text,
  status                      text NOT NULL DEFAULT 'pending',
  -- pending | paid | failed | refunded
  paid_at                     timestamptz,    -- set by webhook only
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

-- ── 10. COMMISSION SHIPPING ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commission_shipping (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  commission_id      uuid NOT NULL UNIQUE REFERENCES commissions(id),
  carrier            text,
  tracking_number    text,
  tracking_url       text,
  estimated_delivery date,
  shipped_at         timestamptz,
  delivered_at       timestamptz,
  client_note        text,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

-- ── 11. AUDIT LOGS (append-only) ─────────────────────────────────────────────
-- Written only by server-side service role. Clients can read their own events.
CREATE TABLE IF NOT EXISTS audit_logs (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type    text NOT NULL,
  actor_type    text NOT NULL,   -- admin | client | system | stripe
  actor_id      uuid,
  commission_id uuid,
  client_id     uuid,
  document_id   uuid,
  metadata      jsonb,           -- no secrets stored here
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_portal_clients_auth   ON portal_clients(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_portal_clients_email  ON portal_clients(email);
CREATE INDEX IF NOT EXISTS idx_commissions_client    ON commissions(client_id);
CREATE INDEX IF NOT EXISTS idx_commissions_ref       ON commissions(reference);
CREATE INDEX IF NOT EXISTS idx_commissions_status    ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_timeline_commission   ON commission_timeline(commission_id, stage_order);
CREATE INDEX IF NOT EXISTS idx_updates_commission    ON commission_updates(commission_id);
CREATE INDEX IF NOT EXISTS idx_docs_commission       ON commission_documents(commission_id);
CREATE INDEX IF NOT EXISTS idx_concepts_commission   ON concept_versions(commission_id);
CREATE INDEX IF NOT EXISTS idx_approvals_commission  ON concept_approvals(commission_id);
CREATE INDEX IF NOT EXISTS idx_payments_commission   ON commission_payments(commission_id);
CREATE INDEX IF NOT EXISTS idx_payments_session      ON commission_payments(stripe_checkout_session_id);
CREATE INDEX IF NOT EXISTS idx_audit_commission      ON audit_logs(commission_id);
CREATE INDEX IF NOT EXISTS idx_audit_client          ON audit_logs(client_id);

-- ═══════════════════════════════════════════════════════════════════════════════
-- ENABLE ROW LEVEL SECURITY ON ALL NEW TABLES
-- ═══════════════════════════════════════════════════════════════════════════════
ALTER TABLE portal_clients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions          ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_timeline  ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_updates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_versions     ENABLE ROW LEVEL SECURITY;
ALTER TABLE concept_approvals    ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_payments  ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_shipping  ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;

-- ═══════════════════════════════════════════════════════════════════════════════
-- RLS POLICIES
-- Chain: auth.uid() → portal_clients.auth_user_id → portal_clients.id
--                    → commissions.client_id → all child tables
--
-- Clients can SELECT only. All INSERT/UPDATE/DELETE is via service role only.
-- Exception: concept_approvals allows client INSERT (with ownership check).
-- ═══════════════════════════════════════════════════════════════════════════════

-- portal_clients: each client sees only their own row
CREATE POLICY "pc_select_own" ON portal_clients
  FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

-- commissions
CREATE POLICY "c_select_own" ON commissions
  FOR SELECT TO authenticated
  USING (
    client_id IN (
      SELECT id FROM portal_clients WHERE auth_user_id = auth.uid()
    )
  );

-- commission_timeline
CREATE POLICY "ct_select_own" ON commission_timeline
  FOR SELECT TO authenticated
  USING (
    commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- commission_updates — is_client_visible = false rows are invisible
CREATE POLICY "cu_select_own_visible" ON commission_updates
  FOR SELECT TO authenticated
  USING (
    is_client_visible = true
    AND commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- commission_documents — is_client_visible = false rows are invisible
CREATE POLICY "cd_select_own_visible" ON commission_documents
  FOR SELECT TO authenticated
  USING (
    is_client_visible = true
    AND commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- concept_versions
CREATE POLICY "cv_select_own" ON concept_versions
  FOR SELECT TO authenticated
  USING (
    commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- concept_approvals — SELECT
CREATE POLICY "ca_select_own" ON concept_approvals
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM portal_clients WHERE auth_user_id = auth.uid())
  );

-- concept_approvals — INSERT (client approves their own concept)
-- WITH CHECK enforces the full ownership chain
CREATE POLICY "ca_insert_own" ON concept_approvals
  FOR INSERT TO authenticated
  WITH CHECK (
    auth_user_id = auth.uid()
    AND client_id IN (
      SELECT id FROM portal_clients WHERE auth_user_id = auth.uid()
    )
    AND commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- commission_payments — SELECT only; status is set by webhook
CREATE POLICY "cp_select_own" ON commission_payments
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM portal_clients WHERE auth_user_id = auth.uid())
  );

-- commission_shipping
CREATE POLICY "cs_select_own" ON commission_shipping
  FOR SELECT TO authenticated
  USING (
    commission_id IN (
      SELECT c.id FROM commissions c
      JOIN portal_clients pc ON pc.id = c.client_id
      WHERE pc.auth_user_id = auth.uid()
    )
  );

-- audit_logs — client reads own events only (append-only via service role)
CREATE POLICY "al_select_own" ON audit_logs
  FOR SELECT TO authenticated
  USING (
    client_id IN (SELECT id FROM portal_clients WHERE auth_user_id = auth.uid())
  );

COMMIT;

-- ═══════════════════════════════════════════════════════════════════════════════
-- STORAGE BUCKET — run this separately if you prefer SQL over the Dashboard UI
-- ═══════════════════════════════════════════════════════════════════════════════
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('commission-documents', 'commission-documents', false)
-- ON CONFLICT (id) DO NOTHING;
