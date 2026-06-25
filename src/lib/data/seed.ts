import type { Artwork, PrintClubMonth, Product } from "@/lib/types";

export const seedArtworks: Artwork[] = [
  {
    id: "artwork-001",
    slug: "threshold-study",
    title: "Threshold Study",
    year: 2025,
    medium: "Mixed media, pigment, found material",
    dimensions: "42 x 59 cm",
    description:
      "A quiet study of surface, pressure, and traces left by repeated handling.",
    status: "available",
    categories: ["original", "multimedia"],
    series: "Thresholds",
    priceGbp: 850,
    editionInfo: "Original 1 of 1",
    shippingNotes:
      "Original works may require insured shipping. International buyers are responsible for local duties and import charges.",
    certificateNote: "Supplied with a signed certificate of authenticity.",
    printAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "artwork-002",
    slug: "soft-archive",
    title: "Soft Archive",
    year: 2024,
    medium: "Photographic print and graphite",
    dimensions: "30 x 40 cm",
    description:
      "An image-based work considering memory, soft evidence, and repetition.",
    status: "sold",
    categories: ["photography", "print"],
    series: "Index Notes",
    priceGbp: null,
    editionInfo: "Sold original. Print edition available.",
    shippingNotes:
      "Prints are shipped from the UK. Customs duties and import charges are paid by the buyer where applicable.",
    certificateNote: "Print editions include edition details and signature.",
    printAvailable: true,
    imageUrl:
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "artwork-003",
    slug: "digital-fragment-12",
    title: "Digital Fragment 12",
    year: 2026,
    medium: "Digital image",
    dimensions: "Variable",
    description:
      "A digital fragment built from scans, light leaks, and compressed gestures.",
    status: "available",
    categories: ["digital"],
    series: "Fragments",
    priceGbp: 120,
    editionInfo: "Digital edition of 25",
    shippingNotes: "Digital files are delivered through the account area after purchase.",
    certificateNote: "Digital editions include a purchase record and edition note.",
    printAvailable: false,
    imageUrl:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

export const seedProducts: Product[] = [
  {
    id: "product-001",
    slug: "threshold-study-original",
    title: "Threshold Study, original",
    productType: "original",
    artworkId: "artwork-001",
    description: "Original 1 of 1 mixed media work.",
    priceGbp: 850,
    stockQuantity: 1,
    isActive: true,
    imageUrl: seedArtworks[0].imageUrl,
    stripePriceId: null
  },
  {
    id: "product-002",
    slug: "soft-archive-print",
    title: "Soft Archive, print",
    productType: "physical_print",
    artworkId: "artwork-002",
    description: "Signed physical print shipped from the UK.",
    priceGbp: 65,
    stockQuantity: 50,
    isActive: true,
    imageUrl: seedArtworks[1].imageUrl,
    stripePriceId: null
  },
  {
    id: "product-003",
    slug: "digital-fragment-12-download",
    title: "Digital Fragment 12, download",
    productType: "digital_download",
    artworkId: "artwork-003",
    description: "Digital edition with account access after purchase.",
    priceGbp: 120,
    stockQuantity: 25,
    isActive: true,
    imageUrl: seedArtworks[2].imageUrl,
    stripePriceId: null
  }
];

export const seedPrintClubMonths: PrintClubMonth[] = [
  {
    id: "print-club-2026-01",
    title: "January Letter",
    month: 1,
    year: 2026,
    description:
      "The first print in the yearly project, with a short studio letter and process notes.",
    imageUrl:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    subscriberOnly: true
  },
  {
    id: "print-club-2026-02",
    title: "February Letter",
    month: 2,
    year: 2026,
    description: "A second monthly work prepared as a physical print and digital file.",
    imageUrl:
      "https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=1200&q=80",
    subscriberOnly: true
  }
];
