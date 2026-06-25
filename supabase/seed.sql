insert into artworks (
  slug,
  title,
  year,
  medium,
  dimensions,
  description,
  status,
  categories,
  series,
  price_gbp,
  edition_info,
  shipping_notes,
  certificate_note,
  print_available,
  image_url,
  gallery
) values
(
  'threshold-study',
  'Threshold Study',
  2025,
  'Mixed media, pigment, found material',
  '42 x 59 cm',
  'A quiet study of surface, pressure, and traces left by repeated handling.',
  'available',
  array['original','multimedia'],
  'Thresholds',
  850,
  'Original 1 of 1',
  'Original works may require insured shipping. International buyers are responsible for local duties and import charges.',
  'Supplied with a signed certificate of authenticity.',
  true,
  'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80',
  array['https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80']
),
(
  'soft-archive',
  'Soft Archive',
  2024,
  'Photographic print and graphite',
  '30 x 40 cm',
  'An image-based work considering memory, soft evidence, and repetition.',
  'sold',
  array['photography','print'],
  'Index Notes',
  null,
  'Sold original. Print edition available.',
  'Prints are shipped from the UK. Customs duties and import charges are paid by the buyer where applicable.',
  'Print editions include edition details and signature.',
  true,
  'https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80',
  array['https://images.unsplash.com/photo-1515405295579-ba7b45403062?auto=format&fit=crop&w=1200&q=80']
),
(
  'digital-fragment-12',
  'Digital Fragment 12',
  2026,
  'Digital image',
  'Variable',
  'A digital fragment built from scans, light leaks, and compressed gestures.',
  'available',
  array['digital'],
  'Fragments',
  120,
  'Digital edition of 25',
  'Digital files are delivered through the account area after purchase.',
  'Digital editions include a purchase record and edition note.',
  false,
  'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80',
  array['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&w=1200&q=80']
);

insert into products (
  slug,
  title,
  product_type,
  artwork_id,
  description,
  price_gbp,
  stock_quantity,
  is_active,
  image_url
)
select
  'threshold-study-original',
  'Threshold Study, original',
  'original',
  id,
  'Original 1 of 1 mixed media work.',
  850,
  1,
  true,
  image_url
from artworks where slug = 'threshold-study';

insert into products (
  slug,
  title,
  product_type,
  artwork_id,
  description,
  price_gbp,
  stock_quantity,
  is_active,
  image_url
)
select
  'soft-archive-print',
  'Soft Archive, print',
  'physical_print',
  id,
  'Signed physical print shipped from the UK.',
  65,
  50,
  true,
  image_url
from artworks where slug = 'soft-archive';

insert into products (
  slug,
  title,
  product_type,
  artwork_id,
  description,
  price_gbp,
  stock_quantity,
  is_active,
  image_url
)
select
  'digital-fragment-12-download',
  'Digital Fragment 12, download',
  'digital_download',
  id,
  'Digital edition with account access after purchase.',
  120,
  25,
  true,
  image_url
from artworks where slug = 'digital-fragment-12';

insert into print_club_projects (title, year, description)
values (
  'Print Club 2026',
  2026,
  'A yearly mini-project of twelve monthly works.'
);

insert into print_club_months (
  project_id,
  title,
  month,
  year,
  description,
  image_url,
  subscriber_only
)
select
  id,
  'January Letter',
  1,
  2026,
  'The first print in the yearly project, with a short studio letter and process notes.',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
  true
from print_club_projects where year = 2026;

insert into site_content (key, title, body)
values
('artist_statement', 'Artist statement', 'Artist statement to be added.'),
('biography', 'Biography', 'Biography to be added.');
