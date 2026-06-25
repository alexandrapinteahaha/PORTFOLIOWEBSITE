export type ArtworkStatus = "available" | "sold" | "archived" | "hidden";

export type ArtworkCategory =
  | "original"
  | "sculpture"
  | "multimedia"
  | "photography"
  | "digital"
  | "print";

export type ProductType =
  | "original"
  | "physical_print"
  | "print_club_subscription"
  | "digital_download"
  | "commission_enquiry"
  | "archive_only";

export type Artwork = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string;
  description: string;
  status: ArtworkStatus;
  categories: ArtworkCategory[];
  series: string | null;
  priceGbp: number | null;
  editionInfo: string | null;
  shippingNotes: string | null;
  certificateNote: string;
  printAvailable: boolean;
  imageUrl: string;
  gallery: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  productType: ProductType;
  artworkId: string | null;
  description: string;
  priceGbp: number | null;
  stockQuantity: number | null;
  isActive: boolean;
  imageUrl: string;
  stripePriceId: string | null;
};

export type PrintClubMonth = {
  id: string;
  title: string;
  month: number;
  year: number;
  description: string;
  imageUrl: string;
  digitalFileUrl?: string;
  processPdfUrl?: string;
  monthlyLetterUrl?: string;
  subscriberOnly: boolean;
};

export type CommissionEnquiry = {
  name: string;
  email: string;
  phone?: string;
  commissionType: string;
  budgetRange: string;
  timeframe: string;
  message: string;
};
