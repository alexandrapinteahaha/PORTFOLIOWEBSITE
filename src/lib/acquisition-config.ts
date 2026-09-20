// Configurable settings for high-value original artwork acquisitions.
// Update these values here — they are referenced throughout the site.
// Do not duplicate these values elsewhere.

export const ACQUISITION_CONFIG = {
  // The GBP price threshold above which the High-Value Acquisition notice is shown.
  // Approximately USD $50,000 / EUR €46,000 at indicative rates.
  // The GBP amount is the operative figure on this website.
  highValueThresholdGbp: 40_000,

  // Indicative USD and EUR equivalents displayed in the policy and notices.
  // These are for collector reference only; the GBP amount is contractually operative.
  highValueThresholdUsdDisplay: "50,000",
  highValueThresholdEurDisplay: "46,000",

  // Reservation deposit for qualifying high-value acquisitions.
  // The actual deposit for a specific work is confirmed with the collector individually.
  reservationDepositGbp: 16_000,
  reservationDepositUsdDisplay: "20,000",

  // Balance payment window in hours after reservation deposit is confirmed.
  balancePaymentHours: 48,

  // Policy version and effective date (shown at the bottom of the policy page).
  policyVersion: "1.0",
  policyEffectiveDate: "September 2026",
} as const;
