-- SKU counters are kept per category so concurrent product creation cannot
-- produce duplicate SKUs. Apply this migration after the initial schema.
ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS sku_prefix VARCHAR(20);

CREATE TABLE IF NOT EXISTS public.product_sku_counters (
  category_id UUID PRIMARY KEY REFERENCES public.categories(id) ON DELETE CASCADE,
  last_number INTEGER NOT NULL DEFAULT 0 CHECK (last_number >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.category_sku_prefix(category_name TEXT)
RETURNS TEXT LANGUAGE sql IMMUTABLE AS $$
  SELECT COALESCE(NULLIF(UPPER(REGEXP_REPLACE(category_name, '[^A-Za-z0-9]+', '', 'g')), ''), 'CAT')
$$;

CREATE OR REPLACE FUNCTION public.preview_product_sku(p_category_id UUID)
RETURNS TEXT LANGUAGE plpgsql STABLE AS $$
DECLARE v_prefix TEXT; v_last_number INTEGER;
BEGIN
  SELECT COALESCE(NULLIF(sku_prefix, ''), public.category_sku_prefix(name)) INTO v_prefix FROM public.categories WHERE id = p_category_id AND is_active = TRUE;
  IF v_prefix IS NULL THEN RAISE EXCEPTION 'Category not found or inactive'; END IF;
  SELECT last_number INTO v_last_number FROM public.product_sku_counters WHERE category_id = p_category_id;
  RETURN v_prefix || '-' || LPAD((COALESCE(v_last_number, 0) + 1)::TEXT, 5, '0');
END;
$$;

CREATE OR REPLACE FUNCTION public.create_product_with_category_sku(
  p_category_id UUID, p_title TEXT, p_slug TEXT, p_description TEXT, p_base_price DECIMAL,
  p_sale_price DECIMAL, p_stock_quantity INTEGER, p_featured_image_url TEXT DEFAULT NULL, p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS public.products
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE v_prefix TEXT; v_number INTEGER; v_sku TEXT; v_product public.products;
BEGIN
  IF public.get_user_role() NOT IN ('admin', 'super_admin') THEN RAISE EXCEPTION 'Admin permission required'; END IF;
  IF p_title IS NULL OR BTRIM(p_title) = '' THEN RAISE EXCEPTION 'Product title is required'; END IF;
  IF p_slug IS NULL OR p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' THEN RAISE EXCEPTION 'Slug must contain lowercase letters, numbers, and hyphens only'; END IF;
  IF p_base_price IS NULL OR p_base_price < 0 OR p_stock_quantity < 0 THEN RAISE EXCEPTION 'Price and stock must not be negative'; END IF;
  SELECT COALESCE(NULLIF(sku_prefix, ''), public.category_sku_prefix(name)) INTO v_prefix FROM public.categories WHERE id = p_category_id AND is_active = TRUE FOR UPDATE;
  IF v_prefix IS NULL THEN RAISE EXCEPTION 'Category not found or inactive'; END IF;
  INSERT INTO public.product_sku_counters (category_id, last_number, updated_at) VALUES (p_category_id, 1, NOW()) ON CONFLICT (category_id) DO UPDATE SET last_number = public.product_sku_counters.last_number + 1, updated_at = NOW() RETURNING last_number INTO v_number;
  v_sku := v_prefix || '-' || LPAD(v_number::TEXT, 5, '0');
  INSERT INTO public.products (sku, title, slug, category_id, description, base_price, sale_price, stock_quantity, featured_image_url, is_active) VALUES (v_sku, BTRIM(p_title), p_slug, p_category_id, NULLIF(BTRIM(p_description), ''), p_base_price, p_sale_price, p_stock_quantity, NULLIF(BTRIM(p_featured_image_url), ''), p_is_active) RETURNING * INTO v_product;
  RETURN v_product;
END;
$$;

GRANT EXECUTE ON FUNCTION public.preview_product_sku(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_product_with_category_sku(UUID, TEXT, TEXT, TEXT, DECIMAL, DECIMAL, INTEGER, TEXT, BOOLEAN) TO authenticated;
