import {
  createArtwork,
  createPrintClubMonth,
  createProduct
} from "@/app/admin/actions";

export function ArtworkForm() {
  return (
    <form action={createArtwork} className="grid gap-4 border border-line bg-chalk p-5">
      <h2 className="font-title text-3xl">Add Artwork</h2>

      {/* Image upload */}
      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Image
        <input
          type="file"
          name="image"
          accept="image/*"
          required
          className="focus-ring border border-line bg-paper px-3 py-2 text-sm file:mr-3 file:border-0 file:bg-ink file:px-3 file:py-1 file:text-xs file:text-chalk"
        />
      </label>

      <Field name="title" label="Title" required />
      <Field name="slug" label="Slug (e.g. baby-machine — no spaces)" required />
      <Field name="year" label="Year" type="number" required />

      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Medium
        <select name="medium_type" className="focus-ring min-h-10 border border-line bg-paper px-3 text-sm">
          <option value="painting">Painting</option>
          <option value="sculpture">Sculpture</option>
          <option value="multimedia">Mixed Media</option>
          <option value="photography">Photography</option>
          <option value="digital">Digital</option>
          <option value="print">Print</option>
        </select>
      </label>

      <Field name="medium" label="Materials" />
      <Field name="dimensions" label="Dimensions" />
      <Field name="edition_info" label="Rarity" />
      <Field name="certificate_note" label="COA" />
      <Field name="shipping_notes" label="Frame Info" />
      <Field name="series" label="Collection" />

      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Description
        <textarea name="description" rows={4} className="focus-ring border border-line bg-paper p-3 text-sm" />
      </label>

      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Status
        <select name="status" className="focus-ring min-h-10 border border-line bg-paper px-3 text-sm">
          <option value="available">Available</option>
          <option value="sold">Sold</option>
          <option value="archived">Archived</option>
          <option value="hidden">Hidden</option>
        </select>
      </label>

      <button className="focus-ring min-h-10 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.14em] text-chalk transition hover:bg-graphite">
        Save Artwork
      </button>
    </form>
  );
}

export function ProductForm() {
  return (
    <form action={createProduct} className="grid gap-3 border border-line bg-chalk p-4">
      <h2 className="font-title text-3xl">Add Product</h2>
      <Field name="title" label="Title" required />
      <Field name="slug" label="Slug" required />
      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Product type
        <select name="product_type" className="focus-ring min-h-10 border border-line bg-paper px-3 text-sm">
          <option value="original">Original artwork</option>
          <option value="physical_print">Physical print</option>
          <option value="digital_download">Digital download</option>
          <option value="commission_enquiry">Commission enquiry</option>
          <option value="archive_only">Archive only</option>
        </select>
      </label>
      <Field name="artwork_id" label="Artwork ID (optional)" />
      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Description
        <textarea name="description" rows={4} className="focus-ring border border-line bg-paper p-3 text-sm" />
      </label>
      <Field name="price_gbp" label="Price GBP" type="number" />
      <Field name="stock_quantity" label="Stock quantity" type="number" />
      <Field name="image_url" label="Image URL" required />
      <Field name="stripe_price_id" label="Stripe Price ID (optional)" />
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked />
        Active
      </label>
      <button className="focus-ring min-h-10 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.14em] text-chalk transition hover:bg-graphite">
        Save Product
      </button>
    </form>
  );
}

export function PrintClubMonthForm() {
  return (
    <form action={createPrintClubMonth} className="grid gap-3 border border-line bg-chalk p-4">
      <h2 className="font-title text-3xl">Add Print Club Month</h2>
      <Field name="project_id" label="Project ID (optional)" />
      <Field name="title" label="Title" required />
      <Field name="month" label="Month" type="number" required />
      <Field name="year" label="Year" type="number" required />
      <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
        Description
        <textarea name="description" rows={4} className="focus-ring border border-line bg-paper p-3 text-sm" />
      </label>
      <Field name="image_url" label="Main artwork image URL" required />
      <button className="focus-ring min-h-10 border border-ink bg-ink px-4 text-xs font-semibold uppercase tracking-[0.14em] text-chalk transition hover:bg-graphite">
        Save Month
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-1 text-xs uppercase tracking-[0.12em] text-graphite">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="focus-ring min-h-10 border border-line bg-paper px-3 text-sm"
      />
    </label>
  );
}
