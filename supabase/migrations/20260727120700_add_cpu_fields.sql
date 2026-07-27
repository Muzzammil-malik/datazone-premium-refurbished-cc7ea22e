-- Add CPU-related fields to products table
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS cores_threads text;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS clock_speed text;
