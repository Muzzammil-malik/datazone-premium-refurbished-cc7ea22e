-- Create variant_groups table
CREATE TABLE public.variant_groups (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  name text NOT NULL,
  "order" int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create variant_options table
CREATE TABLE public.variant_options (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  variant_group_id text NOT NULL REFERENCES public.variant_groups(id) ON DELETE CASCADE,
  value text NOT NULL,
  price_adjustment int NOT NULL DEFAULT 0,
  original_price_adjustment int DEFAULT 0,
  stock int NOT NULL DEFAULT 0,
  availability text NOT NULL DEFAULT 'In stock',
  sku text,
  "order" int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grant permissions for variant_groups
GRANT SELECT, INSERT, UPDATE, DELETE ON public.variant_groups TO anon, authenticated;
GRANT ALL ON public.variant_groups TO service_role;

-- Enable RLS for variant_groups
ALTER TABLE public.variant_groups ENABLE ROW LEVEL SECURITY;

-- Create policies for variant_groups
CREATE POLICY "variant_groups read" ON public.variant_groups FOR SELECT USING (true);
CREATE POLICY "variant_groups write" ON public.variant_groups FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions for variant_options
GRANT SELECT, INSERT, UPDATE, DELETE ON public.variant_options TO anon, authenticated;
GRANT ALL ON public.variant_options TO service_role;

-- Enable RLS for variant_options
ALTER TABLE public.variant_options ENABLE ROW LEVEL SECURITY;

-- Create policies for variant_options
CREATE POLICY "variant_options read" ON public.variant_options FOR SELECT USING (true);
CREATE POLICY "variant_options write" ON public.variant_options FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for faster lookups
CREATE INDEX idx_variant_groups_product_id ON public.variant_groups(product_id);
CREATE INDEX idx_variant_options_variant_group_id ON public.variant_options(variant_group_id);

-- Add base_price column to products table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'products' AND column_name = 'base_price'
  ) THEN
    ALTER TABLE public.products ADD COLUMN base_price int;
  END IF;
END $$;

-- Migrate existing variants to new structure
-- This will group existing variants by their type
INSERT INTO public.variant_groups (id, product_id, name, "order")
SELECT 
  gen_random_uuid()::text,
  product_id,
  type,
  MIN("order")
FROM public.product_variants
GROUP BY product_id, type
ON CONFLICT DO NOTHING;

-- Migrate variant options
INSERT INTO public.variant_options (variant_group_id, value, price_adjustment, original_price_adjustment, stock, availability, sku, "order")
SELECT 
  vg.id,
  pv.value,
  pv.price,
  pv.original_price,
  pv.stock,
  pv.availability,
  pv.sku,
  pv."order"
FROM public.product_variants pv
JOIN (
  SELECT 
    vg.id,
    vg.product_id,
    vg.name as type,
    ROW_NUMBER() OVER (PARTITION BY vg.product_id, vg.name ORDER BY pv."order") as rn
  FROM variant_groups vg
  JOIN product_variants pv ON vg.product_id = pv.product_id AND vg.name = pv.type
) vg ON pv.product_id = vg.product_id AND pv.type = vg.type
JOIN variant_groups vg_final ON vg_final.id = vg.id
ON CONFLICT DO NOTHING;

-- Update products base_price from current price (if base_price is null)
UPDATE public.products
SET base_price = price
WHERE base_price IS NULL;

-- Note: We keep the old product_variants table for now as backup
-- After verification, you can drop it with:
-- DROP TABLE public.product_variants CASCADE;
