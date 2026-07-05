
CREATE TABLE public.categories (
  id text PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  "order" int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "categories read" ON public.categories FOR SELECT USING (true);
CREATE POLICY "categories write" ON public.categories FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.brands (
  id text PRIMARY KEY,
  name text NOT NULL,
  logo text,
  description text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.brands TO anon, authenticated;
GRANT ALL ON public.brands TO service_role;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
CREATE POLICY "brands read" ON public.brands FOR SELECT USING (true);
CREATE POLICY "brands write" ON public.brands FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.products (
  id text PRIMARY KEY,
  name text NOT NULL,
  brand text NOT NULL,
  category text NOT NULL,
  processor text NOT NULL DEFAULT '',
  ram text NOT NULL DEFAULT '',
  storage text NOT NULL DEFAULT '',
  gpu text NOT NULL DEFAULT '',
  price int NOT NULL DEFAULT 0,
  original_price int NOT NULL DEFAULT 0,
  condition text NOT NULL DEFAULT 'Grade A',
  availability text NOT NULL DEFAULT 'In stock',
  image text NOT NULL DEFAULT '',
  tagline text NOT NULL DEFAULT '',
  rating numeric NOT NULL DEFAULT 4.7,
  reviews int NOT NULL DEFAULT 0,
  model text,
  description text,
  display_size text,
  resolution text,
  battery_health int,
  windows text,
  office boolean DEFAULT false,
  charger boolean DEFAULT true,
  slug text,
  meta_title text,
  meta_description text,
  keywords text,
  featured boolean NOT NULL DEFAULT false,
  new_arrival boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  images text[] NOT NULL DEFAULT ARRAY[]::text[],
  video text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products read" ON public.products FOR SELECT USING (true);
CREATE POLICY "products write" ON public.products FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.inventory (
  id text PRIMARY KEY,
  product_id text REFERENCES public.products(id) ON DELETE SET NULL,
  serial text NOT NULL,
  supplier text NOT NULL DEFAULT '',
  purchase_date date NOT NULL DEFAULT CURRENT_DATE,
  battery_health int,
  ssd_health int,
  qc_status text NOT NULL DEFAULT 'Pending',
  shelf text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Available',
  remarks text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inventory TO anon, authenticated;
GRANT ALL ON public.inventory TO service_role;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inventory all" ON public.inventory FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.inquiries (
  id text PRIMARY KEY,
  customer text NOT NULL,
  phone text NOT NULL DEFAULT '',
  product_id text,
  product_name text,
  date timestamptz NOT NULL DEFAULT now(),
  source text NOT NULL DEFAULT 'Website',
  notes text,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "inquiries all" ON public.inquiries FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.services (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Wrench',
  featured boolean NOT NULL DEFAULT false,
  "order" int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services read" ON public.services FOR SELECT USING (true);
CREATE POLICY "services write" ON public.services FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.reviews (
  id text PRIMARY KEY,
  customer text NOT NULL,
  rating int NOT NULL DEFAULT 5,
  text text NOT NULL DEFAULT '',
  date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'Pending',
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews write" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.banners (
  id text PRIMARY KEY,
  type text NOT NULL DEFAULT 'Homepage Hero',
  image text,
  title text NOT NULL DEFAULT '',
  subtitle text NOT NULL DEFAULT '',
  cta text NOT NULL DEFAULT '',
  link text NOT NULL DEFAULT '',
  start_date date,
  end_date date,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.banners TO anon, authenticated;
GRANT ALL ON public.banners TO service_role;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
CREATE POLICY "banners read" ON public.banners FOR SELECT USING (true);
CREATE POLICY "banners write" ON public.banners FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.homepage (
  id int PRIMARY KEY DEFAULT 1,
  hero_headline text NOT NULL DEFAULT '',
  hero_subtitle text NOT NULL DEFAULT '',
  featured_ids text[] NOT NULL DEFAULT ARRAY[]::text[],
  why jsonb NOT NULL DEFAULT '[]'::jsonb,
  testimonial_ids text[] NOT NULL DEFAULT ARRAY[]::text[],
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT homepage_singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.homepage TO anon, authenticated;
GRANT ALL ON public.homepage TO service_role;
ALTER TABLE public.homepage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "homepage read" ON public.homepage FOR SELECT USING (true);
CREATE POLICY "homepage write" ON public.homepage FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.settings (
  id int PRIMARY KEY DEFAULT 1,
  store_name text NOT NULL DEFAULT 'DATAZONe',
  logo text,
  favicon text,
  whatsapp text NOT NULL DEFAULT '919999999999',
  phone text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  maps_link text NOT NULL DEFAULT '',
  hours text NOT NULL DEFAULT '',
  social jsonb NOT NULL DEFAULT '{"facebook":"","instagram":"","youtube":"","linkedin":"","website":""}'::jsonb,
  seo jsonb NOT NULL DEFAULT '{"gaId":"","metaTitle":"","metaDescription":""}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT settings_singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO anon, authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings write" ON public.settings FOR ALL USING (true) WITH CHECK (true);

CREATE TABLE public.activity (
  id text PRIMARY KEY,
  kind text NOT NULL,
  message text NOT NULL,
  at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activity TO anon, authenticated;
GRANT ALL ON public.activity TO service_role;
ALTER TABLE public.activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "activity all" ON public.activity FOR ALL USING (true) WITH CHECK (true);
