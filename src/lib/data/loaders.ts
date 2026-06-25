import { seedArtworks, seedPrintClubMonths, seedProducts } from "@/lib/data/seed";
import { createPublicSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/public";
import type {
  Artwork,
  ArtworkCategory,
  ArtworkStatus,
  PrintClubMonth,
  Product,
  ProductType
} from "@/lib/types";

type ArtworkRow = {
  id: string;
  slug: string;
  title: string;
  year: number;
  medium: string;
  dimensions: string | null;
  description: string | null;
  status: ArtworkStatus;
  categories: ArtworkCategory[] | null;
  series: string | null;
  price_gbp: number | null;
  edition_info: string | null;
  shipping_notes: string | null;
  certificate_note: string | null;
  print_available: boolean | null;
  image_url: string | null;
  gallery: string[] | null;
};

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  product_type: ProductType;
  artwork_id: string | null;
  description: string | null;
  price_gbp: number | null;
  stock_quantity: number | null;
  is_active: boolean;
  image_url: string | null;
  stripe_price_id: string | null;
};

function mapArtwork(row: ArtworkRow): Artwork {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    year: row.year,
    medium: row.medium,
    dimensions: row.dimensions ?? "",
    description: row.description ?? "",
    status: row.status,
    categories: row.categories ?? [],
    series: row.series,
    priceGbp: row.price_gbp,
    editionInfo: row.edition_info,
    shippingNotes: row.shipping_notes,
    certificateNote: row.certificate_note ?? "Certificate details available on request.",
    printAvailable: row.print_available ?? false,
    imageUrl: row.image_url ?? "",
    gallery: row.gallery ?? []
  };
}

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    productType: row.product_type,
    artworkId: row.artwork_id,
    description: row.description ?? "",
    priceGbp: row.price_gbp,
    stockQuantity: row.stock_quantity,
    isActive: row.is_active,
    imageUrl: row.image_url ?? "",
    stripePriceId: row.stripe_price_id
  };
}

export async function getArtworks(): Promise<Artwork[]> {
  if (!hasSupabaseEnv()) {
    return seedArtworks;
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("artworks_public")
    .select("*")
    .order("year", { ascending: false });

  if (error || !data) {
    return seedArtworks;
  }

  return (data as ArtworkRow[]).map(mapArtwork);
}

export async function getArtworkBySlug(slug: string) {
  const artworks = await getArtworks();
  return artworks.find((artwork) => artwork.slug === slug) ?? null;
}

export async function getProducts(): Promise<Product[]> {
  if (!hasSupabaseEnv()) {
    return seedProducts;
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products_public")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return seedProducts;
  }

  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getPrintClubMonths(): Promise<PrintClubMonth[]> {
  if (!hasSupabaseEnv()) {
    return seedPrintClubMonths;
  }

  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("print_club_months_public")
    .select("*")
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  if (error || !data) {
    return seedPrintClubMonths;
  }

  return data.map((row) => ({
    id: row.id,
    title: row.title,
    month: row.month,
    year: row.year,
    description: row.description ?? "",
    imageUrl: row.image_url ?? "",
    subscriberOnly: row.subscriber_only
  }));
}
