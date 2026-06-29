import type { Artwork, PrintClubMonth, Product } from "@/lib/types";

export const seedArtworks: Artwork[] = [
  {
    id: "baby-machine",
    slug: "baby-machine",
    title: "Baby Machine",
    year: 2023,
    medium: "Foam, resin and metal",
    dimensions: "8 × 6 in",
    description: "Original 1 of 1.",
    status: "available",
    categories: ["original", "sculpture"],
    series: null,
    priceGbp: 1800,
    editionInfo: "Original 1 of 1",
    shippingNotes: null,
    certificateNote: "Certificate of authenticity included.",
    printAvailable: false,
    imageUrl: "/artworks/baby-machine.jpg",
    gallery: []
  }
];

export const seedProducts: Product[] = [];

export const seedPrintClubMonths: PrintClubMonth[] = [];
