import type { Metadata } from "next";
import { deleteArtwork, updateArtwork } from "@/app/admin/actions";
import { ArtworkForm } from "@/components/AdminForms";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Artworks"
};

type AdminArtworkRow = {
  id: string;
  title: string;
  slug: string;
  year: number;
  status: string;
  print_available: boolean | null;
  medium: string | null;
  dimensions: string | null;
  edition_info: string | null;
  description: string | null;
  certificate_note: string | null;
  shipping_notes: string | null;
  image_url: string | null;
};

export default async function AdminArtworksPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("artworks")
    .select("id,title,slug,year,status,print_available,medium,dimensions,edition_info,description,certificate_note,shipping_notes,image_url")
    .order("created_at", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-bold">Artworks</h1>
        <p className="mt-2 text-sm text-graphite">
          Add and manage archive entries. Status controls public visibility and purchase availability.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[400px_1fr]">
        <ArtworkForm />

        <div>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.14em] text-graphite">
            All artworks ({(data ?? []).length})
          </h2>
          <div className="grid gap-2">
            {(data ?? []).length === 0 && (
              <p className="text-sm text-graphite">No artworks added yet.</p>
            )}
            {(data as AdminArtworkRow[] ?? []).map((artwork) => (
              <details
                key={artwork.id}
                className="border border-line bg-chalk"
              >
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-serif text-xl">{artwork.title}</p>
                    <p className="mt-1 text-xs text-graphite">
                      {artwork.year}
                      <span className="mx-1.5 text-line">|</span>
                      {artwork.status}
                      {artwork.print_available && (
                        <>
                          <span className="mx-1.5 text-line">|</span>
                          print available
                        </>
                      )}
                    </p>
                  </div>
                  <span className="text-xs text-graphite">Edit ▾</span>
                </summary>

                <div className="border-t border-line p-4">
                  <form action={updateArtwork} className="grid gap-4">
                    <input type="hidden" name="id" value={artwork.id} />
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Replace Image</label>
                      {artwork.image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={artwork.image_url} alt="Current" className="mb-2 h-24 w-24 object-cover border border-line" />
                      )}
                      <input type="file" name="image" accept="image/*" className="border border-line bg-paper px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1 file:text-xs file:text-chalk" />
                      <p className="text-xs text-graphite/60">Leave empty to keep the current image.</p>
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Dimensions</label>
                      <input name="dimensions" defaultValue={artwork.dimensions ?? ""} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Edition</label>
                      <input name="edition_info" defaultValue={artwork.edition_info ?? ""} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Materials</label>
                      <input name="medium" defaultValue={artwork.medium ?? ""} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">COA (certificate note)</label>
                      <input name="certificate_note" defaultValue={artwork.certificate_note ?? ""} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Frame info</label>
                      <input name="shipping_notes" defaultValue={artwork.shipping_notes ?? ""} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <div className="grid gap-1">
                      <label className="text-xs text-graphite uppercase tracking-[0.12em]">Description</label>
                      <textarea name="description" defaultValue={artwork.description ?? ""} rows={5} className="border border-line bg-paper px-3 py-2 text-sm" />
                    </div>
                    <button type="submit" className="focus-ring border border-ink bg-ink px-4 py-2 text-xs text-chalk transition hover:bg-graphite">
                      Save
                    </button>
                  </form>
                  <form action={deleteArtwork} className="mt-2">
                    <input type="hidden" name="id" value={artwork.id} />
                    <button type="submit" className="focus-ring border border-rust px-4 py-2 text-xs text-rust transition hover:bg-rust hover:text-chalk">
                      Delete
                    </button>
                  </form>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
