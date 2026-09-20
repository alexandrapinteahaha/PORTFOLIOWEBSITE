// Central configuration for shipping, carriers, and delivery information.
// Update values here — they propagate to product pages, checkout, and policy text.
// Do not duplicate these values elsewhere.

export type ShippingOption =
  | "artist_shipping_only"     // Artist covers shipping; collector pays duties/taxes
  | "artist_all_inclusive"     // Artist covers shipping AND applicable import charges
  | "buyer_responsible"        // Collector is responsible for shipping and/or duties
  | "confirmed_separately";    // High-value: shipping confirmed with collector per transaction

// ─── Carriers ─────────────────────────────────────────────────────────────────

export const SHIPPING_CARRIERS = {
  // Preferred international carrier for prints and smaller works
  internationalStandard: "DHL Express",
  // For original artworks — may use specialist art logistics depending on
  // value, size, fragility, destination and insurance requirements
  originalArtwork: "DHL Express or specialist art logistics",
} as const;

// ─── Delivery Zone Estimates ──────────────────────────────────────────────────
// Set null for any zone where a verified estimate is not available.
// These values appear on product pages and policy text.
// Do NOT invent times — only set values you can reliably fulfil.

export const DELIVERY_ZONES = {
  uk: {
    label: "United Kingdom",
    estimateBusinessDays: "3–5",
  },
  europe: {
    label: "Europe",
    estimateBusinessDays: null,
  },
  northAmerica: {
    label: "North America",
    estimateBusinessDays: null,
  },
  asiaPacific: {
    label: "Asia-Pacific",
    estimateBusinessDays: null,
  },
  restOfWorld: {
    label: "Rest of World",
    estimateBusinessDays: null,
  },
} as const;

// ─── Checkout Allowed Countries ───────────────────────────────────────────────
// ISO 3166-1 alpha-2 codes. These are passed to Stripe's
// shipping_address_collection. Add or remove countries as needed.
// Do NOT add a country if shipping there is not reliably available.

export const CHECKOUT_ALLOWED_COUNTRIES = [
  "GB", // United Kingdom
  "US", // United States
  "CA", // Canada
  "AU", // Australia
  "NZ", // New Zealand
  "IE", // Ireland
  "FR", // France
  "DE", // Germany
  "IT", // Italy
  "ES", // Spain
  "NL", // Netherlands
  "BE", // Belgium
  "SE", // Sweden
  "NO", // Norway
  "DK", // Denmark
  "FI", // Finland
  "CH", // Switzerland
  "AT", // Austria
  "PT", // Portugal
  "PL", // Poland
  "CZ", // Czech Republic
  "HU", // Hungary
  "GR", // Greece
  "JP", // Japan
  "SG", // Singapore
  "HK", // Hong Kong SAR
  "KR", // South Korea
  "AE", // United Arab Emirates
  "QA", // Qatar
  "SA", // Saudi Arabia
  "BR", // Brazil
  "MX", // Mexico
] as const;

export type AllowedCountry = (typeof CHECKOUT_ALLOWED_COUNTRIES)[number];

// ─── Shipping Option Display Text ─────────────────────────────────────────────
// Collector-facing labels used on product pages and at checkout.

export const SHIPPING_OPTION_LABELS: Record<ShippingOption, { short: string; detail: string }> = {
  artist_shipping_only: {
    short: "Shipping included",
    detail:
      "Shipping is included for this artwork. Applicable import duties, VAT and local taxes are the responsibility of the collector and will be assessed on arrival.",
  },
  artist_all_inclusive: {
    short: "Shipping & import charges included",
    detail:
      "Shipping and applicable import duties and import taxes are included for this artwork.",
  },
  buyer_responsible: {
    short: "Shipping costs apply",
    detail:
      "Shipping costs and any applicable import duties, VAT and local charges are the responsibility of the collector. These will be confirmed on the product page or as part of the individual transaction.",
  },
  confirmed_separately: {
    short: "Shipping confirmed individually",
    detail:
      "Shipping, insurance and import arrangements for this work are confirmed with the collector as part of the individual transaction. Contact the studio before purchase if you have specific requirements.",
  },
};

// ─── Policy Metadata ──────────────────────────────────────────────────────────

export const SHIPPING_POLICY = {
  version: "1.0",
  effectiveDate: "September 2026",
  studioLocation: "United Kingdom",
  contactEmail: "hello@alexandrapintea.art",
} as const;
