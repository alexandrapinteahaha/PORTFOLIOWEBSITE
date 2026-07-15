import type { Artwork, PrintClubMonth, Product } from "@/lib/types";

export const seedArtworks: Artwork[] = [
  {
    id: "baby-machine",
    slug: "baby-machine",
    title: "Baby Machine",
    year: 2023,
    medium: "Foam, Resin and Metal",
    dimensions: "21cm x 15.5cm x 8cm",
    description: "'Baby Machine' examines female anatomy through an industrial visual language. Foam and metal merge organic forms with mechanical structures, creating a visual tension between the body and industry. The work explores pain, reproduction, and the commodification of sexuality, asking at what point reproduction becomes economic value.",
    status: "available",
    categories: ["original", "sculpture"],
    series: null,
    priceGbp: 2500,
    editionInfo: "Original 1 of 1",
    shippingNotes: "D-ring on the back",
    certificateNote: "Included",
    printAvailable: false,
    imageUrl: "/artworks/baby-machine.jpg",
    gallery: []
  }
];

export const seedProducts: Product[] = [];

export const seedPrintClubMonths: PrintClubMonth[] = [];
