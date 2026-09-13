// ─── Portal types ─────────────────────────────────────────────────────────────
// All types used by the commission portal and admin commission management.
// ──────────────────────────────────────────────────────────────────────────────

export type PortalClient = {
  id: string;
  auth_user_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type CommissionStatus =
  | "agreement_pending"
  | "agreement_signed"
  | "deposit_pending"
  | "deposit_paid"
  | "concept"
  | "concept_review"
  | "concept_approved"
  | "production"
  | "final_review"
  | "final_payment_pending"
  | "final_payment_paid"
  | "completed"
  | "shipping"
  | "delivered"
  | "archived";

export type Commission = {
  id: string;
  reference: string;
  client_id: string;
  enquiry_id: string | null;
  artwork_title: string;
  description: string | null;
  medium: string | null;
  dimensions: string | null;
  agreed_price_gbp: number | null;
  currency: string;
  deposit_amount_gbp: number | null;
  status: CommissionStatus;
  estimated_completion: string | null;
  admin_notes: string | null;
  invitation_sent_at: string | null;
  created_at: string;
  updated_at: string;
};

export type TimelineStage = {
  id: string;
  commission_id: string;
  stage: string;
  stage_order: number;
  status: "upcoming" | "active" | "completed";
  completed_at: string | null;
  client_note: string | null;
  admin_note: string | null;
  created_at: string;
};

export type CommissionUpdate = {
  id: string;
  commission_id: string;
  title: string | null;
  body: string;
  is_client_visible: boolean;
  created_at: string;
};

export type CommissionDocument = {
  id: string;
  commission_id: string;
  document_type: string;
  label: string;
  storage_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  is_client_visible: boolean;
  uploaded_at: string;
};

export type ConceptVersion = {
  id: string;
  commission_id: string;
  version_number: number;
  label: string | null;
  storage_path: string;
  notes: string | null;
  admin_notes: string | null;
  status: "pending" | "approved" | "changes_requested" | "superseded";
  created_at: string;
};

export type ConceptApproval = {
  id: string;
  concept_version_id: string;
  commission_id: string;
  client_id: string;
  auth_user_id: string;
  action: "approved" | "changes_requested";
  changes_note: string | null;
  created_at: string;
};

export type CommissionPayment = {
  id: string;
  commission_id: string;
  client_id: string;
  payment_type: "deposit" | "final_payment" | "other";
  amount_gbp: number;
  currency: string;
  stripe_checkout_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: "pending" | "paid" | "failed" | "refunded";
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CommissionShipping = {
  id: string;
  commission_id: string;
  carrier: string | null;
  tracking_number: string | null;
  tracking_url: string | null;
  estimated_delivery: string | null;
  shipped_at: string | null;
  delivered_at: string | null;
  client_note: string | null;
  created_at: string;
  updated_at: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

export const COMMISSION_STATUS_LABELS: Record<string, string> = {
  agreement_pending: "Agreement Pending",
  agreement_signed: "Agreement Signed",
  deposit_pending: "Deposit Pending",
  deposit_paid: "Deposit Paid",
  concept: "Concept",
  concept_review: "Concept Review",
  concept_approved: "Concept Approved",
  production: "In Production",
  final_review: "Final Review",
  final_payment_pending: "Final Payment Due",
  final_payment_paid: "Final Payment Paid",
  completed: "Completed",
  shipping: "Shipping",
  delivered: "Delivered",
  archived: "Archived",
};

export const COMMISSION_STATUSES = Object.keys(COMMISSION_STATUS_LABELS);

export const TIMELINE_STAGES = [
  { stage: "consultation", label: "Consultation", order: 1 },
  { stage: "agreement",    label: "Agreement",    order: 2 },
  { stage: "deposit",      label: "Deposit",      order: 3 },
  { stage: "concept",      label: "Concept",      order: 4 },
  { stage: "production",   label: "Production",   order: 5 },
  { stage: "final_review", label: "Final Review", order: 6 },
  { stage: "delivery",     label: "Delivery",     order: 7 },
];

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  agreement:     "Commission Agreement",
  invoice:       "Invoice",
  receipt:       "Receipt",
  certificate:   "Certificate of Authenticity",
  care_guide:    "Care Guide",
  concept:       "Concept",
  final_artwork: "Final Artwork",
  shipping:      "Shipping Document",
  other:         "Document",
};

export const DOCUMENT_TYPES = Object.keys(DOCUMENT_TYPE_LABELS);

// ─── Utilities ────────────────────────────────────────────────────────────────

export function formatCurrency(amount: number | null, currency = "gbp"): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function sanitiseStorageFilename(original: string, id: string): string {
  const ext = original.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") ?? "bin";
  // Use the document ID + timestamp as the actual filename — never trust user-supplied names
  return `${id}-${Date.now()}.${ext}`;
}

// Validates MIME type against an allowlist for uploaded documents
export const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export const MAX_UPLOAD_BYTES = 25 * 1024 * 1024; // 25 MB

export function validateUpload(file: File): string | null {
  if (file.size > MAX_UPLOAD_BYTES) return "File exceeds 25 MB limit.";
  if (!ALLOWED_MIME_TYPES.has(file.type)) return "File type not permitted.";
  return null;
}
