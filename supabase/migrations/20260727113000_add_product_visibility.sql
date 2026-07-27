-- Add visibility column to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS visibility text NOT NULL DEFAULT 'active';

-- Add check constraint for allowed values
ALTER TABLE public.products ADD CONSTRAINT products_visibility_check 
  CHECK (visibility IN ('active', 'hidden', 'unavailable'));

-- Update existing products: set visibility based on active status
UPDATE public.products SET visibility = 'hidden' WHERE active = false;
UPDATE public.products SET visibility = 'active' WHERE active = true AND visibility = 'active';

-- Note: The 'active' column is kept for backward compatibility but is no longer the primary visibility control
