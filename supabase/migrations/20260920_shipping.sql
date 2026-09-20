-- Add shipping fields to products and update the public view.
-- shipping_option controls how shipping/duty responsibility is communicated
-- on the product page and at checkout.

alter table products
  add column if not exists shipping_option text
    check (shipping_option in (
      'artist_shipping_only',
      'artist_all_inclusive',
      'buyer_responsible',
      'confirmed_separately'
    ));

-- Expose shipping_notes (already in the table) and the new shipping_option
-- through the products_public view so the shop page can read them without
-- requiring the service role key.
create or replace view products_public as
select
  id,
  slug,
  title,
  product_type,
  artwork_id,
  description,
  price_gbp,
  stock_quantity,
  is_active,
  image_url,
  stripe_price_id,
  shipping_notes,
  shipping_option,
  created_at
from products
where is_active = true;
