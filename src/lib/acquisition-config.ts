// Configurable settings for original artwork acquisitions.
// Update values here — they are referenced throughout the site and policy page.
// Do not duplicate these values elsewhere.

export const ACQUISITION_CONFIG = {
  // ─── High-Value Threshold ─────────────────────────────────────────────────
  // GBP amount at or above which the High-Value Acquisition notice is shown.
  // Approximately USD $50,000 / EUR €46,000 at indicative rates.
  // The GBP figure is the operative amount on this website.
  highValueThresholdGbp: 40_000,
  highValueThresholdUsdDisplay: "50,000",
  highValueThresholdEurDisplay: "46,000",

  // ─── Reservation Deposit ──────────────────────────────────────────────────
  // Indicative deposit for qualifying high-value acquisitions.
  // The actual deposit for a specific work is confirmed per transaction.
  reservationDepositGbp: 16_000,
  reservationDepositUsdDisplay: "20,000",

  // ─── Balance Payment ──────────────────────────────────────────────────────
  // Hours after deposit confirmation within which the balance is due.
  balancePaymentHours: 48,

  // ─── Resale Restriction ───────────────────────────────────────────────────
  // Initial period (months) during which the collector agrees not to sell
  // or transfer the artwork without the Artist's written consent,
  // where this is included in the applicable Contract of Sale.
  resaleRestrictionMonths: 24,

  // ─── Right of First Refusal ───────────────────────────────────────────────
  // Days the Artist has to respond to a resale notice after the restriction period.
  rightOfFirstRefusalDays: 30,

  // Window (months) in which the collector may complete a third-party sale
  // after the Artist declines the right of first refusal.
  thirdPartySaleWindowMonths: 3,

  // ─── Policy Version ───────────────────────────────────────────────────────
  policyVersion: "1.0",
  policyEffectiveDate: "September 2026",
} as const;
