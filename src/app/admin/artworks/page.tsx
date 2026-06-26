import type { Metadata } from "next";
import { deleteArtwork } from "@/app/admin/actions";
import { ArtworkForm } from "@/components/AdminForms";
import { AdminNav } from "@/components/layout/AdminNav";
import { requireAdmin } from "@/lib/access";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const metadata: Metadata = {
  title: "Admin: Artworks"
};

export default async function AdminArtworksPage() {
  await requireAdmin();
  const supabase = createSupabaseAdminClient();
  const { data } = await supabase
    .from("artworks")
    .select("id,title,year,status,print_available")
    .order("created_at", { ascending: false });

  return (
    <section className="container-shell py-14">
      <AdminNav />

      <div className="mb-8">
        <h1 className="font-title text-4xl font-light">Artworks</h1>
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
            {(data ?? []).map((artwork) => (
              <div
                key={artwork.id}
                className="grid gap-3 border border-line bg-chalk p-4 md:grid-cols-[1fr_auto]"
              >
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
                <form action={deleteArtwork}>
                  <input type="hidden" name="id" value={artwork.id} />
                  <button className="focus-ring border border-rust px-3 py-2 text-xs text-rust transition hover:bg-rust hover:text-chalk">
                    Delete
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
