import {
  createArtwork,
  createPrintClubMonth,
  createProduct
} from "@/app/admin/actions";

export function ArtworkForm() {
  return (
    <form action={createArtwork} className="grid gap-3 border border-line bg-chalk p-4">
      <FormTitle title="Add artwork" />
      <Input name="title" label="Title" required />
      <Input name="slug" label="Slug" required />
      <Input name="year" label="Year" type="number" required />
      <Input name="medium" label="Medium" required />
      <Input name="dimensions" label="Dimensions" />
      <Textarea name="description" label="Description" />
      <Input name="categories" label="Categories, comma separated" />
      <Input name="series" label="Series" />
      <Input name="price_gbp" label="Price GBP" type="number" />
      <Input name="edition_info" label="Edition information" />
      <Input name="image_url" label="Image URL" required />
      <Select name="status" label="Status">
        <option value="available">Available</option>
        <option value="sold">Sold</option>
        <option value="archived">Archived</option>
        <option value="hidden">Hidden</option>
      </Select>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="print_available" />
        Print available
      </label>
      <Submit label="Save artwork" />
    </form>
  );
}

export function ProductForm() {
  return (
    <form action={createProduct} className="grid gap-3 border border-line bg-chalk p-4">
      <FormTitle title="Add product" />
      <Input name="title" label="Title" required />
      <Input name="slug" label="Slug" required />
      <Select name="product_type" label="Product type">
        <option value="original">Original artwork</option>
        <option value="physical_print">Physical print</option>
        <option value="digital_download">Digital download</option>
        <option value="commission_enquiry">Commission enquiry</option>
        <option value="archive_only">Archive only</option>
      </Select>
      <Input name="artwork_id" label="Artwork ID, optional" />
      <Textarea name="description" label="Description" />
      <Input name="price_gbp" label="Price GBP" type="number" />
      <Input name="stock_quantity" label="Stock quantity" type="number" />
      <Input name="image_url" label="Image URL" required />
      <Input name="stripe_price_id" label="Stripe Price ID, optional" />
      <label className="flex gap-2 text-sm">
        <input type="checkbox" name="is_active" defaultChecked />
        Active
      </label>
      <Submit label="Save product" />
    </form>
  );
}

export function PrintClubMonthForm() {
  return (
    <form action={createPrintClubMonth} className="grid gap-3 border border-line bg-chalk p-4">
      <FormTitle title="Add Print Club month" />
      <Input name="project_id" label="Project ID, optional" />
      <Input name="title" label="Title" required />
      <Input name="month" label="Month" type="number" required />
      <Input name="year" label="Year" type="number" required />
      <Textarea name="description" label="Description" />
      <Input name="image_url" label="Main artwork image URL" required />
      <Submit label="Save month" />
    </form>
  );
}

function FormTitle({ title }: { title: string }) {
  return <h2 className="font-title text-3xl">{title}</h2>;
}

function Input({
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
    <label className="grid gap-1 text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="focus-ring min-h-10 border border-line bg-paper px-3"
      />
    </label>
  );
}

function Textarea({ label, name }: { label: string; name: string }) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <textarea name={name} rows={4} className="focus-ring border border-line bg-paper p-3" />
    </label>
  );
}

function Select({
  label,
  name,
  children
}: {
  label: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1 text-sm">
      {label}
      <select name={name} className="focus-ring min-h-10 border border-line bg-paper px-3">
        {children}
      </select>
    </label>
  );
}

function Submit({ label }: { label: string }) {
  return (
    <button className="focus-ring min-h-10 border border-ink bg-ink px-4 text-sm font-semibold uppercase tracking-[0.1em] text-chalk">
      {label}
    </button>
  );
}
