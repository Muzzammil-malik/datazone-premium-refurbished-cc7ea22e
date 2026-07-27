-- Create product_variants table
CREATE TABLE public.product_variants (
  id text PRIMARY KEY,
  product_id text NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  type text NOT NULL,
  value text NOT NULL,
  price int NOT NULL DEFAULT 0,
  original_price int,
  stock int NOT NULL DEFAULT 0,
  availability text NOT NULL DEFAULT 'In stock',
  sku text,
  "order" int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants TO anon, authenticated;
GRANT ALL ON public.product_variants TO service_role;

-- Enable RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "product_variants read" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "product_variants write" ON public.product_variants FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
