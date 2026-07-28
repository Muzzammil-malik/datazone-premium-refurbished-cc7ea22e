import { useSyncExternalStore, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { adminToast } from "@/lib/admin-toast";

import laptop1 from "@/assets/product-laptop-1.jpg";
import laptop2 from "@/assets/product-laptop-2.jpg";
import desktop1 from "@/assets/product-desktop-1.jpg";
import monitor1 from "@/assets/product-monitor-1.jpg";
import accessories1 from "@/assets/product-accessories-1.jpg";

// Map seed image keys (stored in DB for demo rows) to bundled asset URLs.
const SEED_IMAGES: Record<string, string> = {
  "seed:laptop1": laptop1,
  "seed:laptop2": laptop2,
  "seed:desktop1": desktop1,
  "seed:monitor1": monitor1,
  "seed:accessories1": accessories1,
};
const REVERSE_SEED: Record<string, string> = Object.fromEntries(
  Object.entries(SEED_IMAGES).map(([k, v]) => [v, k])
);
export const resolveImage = (s?: string | null): string =>
  s ? SEED_IMAGES[s] ?? s : "";
const unresolveImage = (s?: string | null): string =>
  s ? REVERSE_SEED[s] ?? s : "";

// ------- Product base type (kept here to avoid circular imports) -------
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: "Laptops" | "Desktops" | "Monitors" | "Accessories" | string;
  processor: string;
  ram: string;
  storage: string;
  gpu: string;
  price: number;
  original: number;
  condition: "Grade A" | "Grade A+" | "Grade B" | string;
  availability: "In stock" | "Low stock" | "Out of stock" | string;
  image: string;
  images?: string[];
  tagline: string;
  rating: number;
  reviews: number;
  description?: string;
  featured?: boolean;
  visibility?: "active" | "hidden" | "unavailable";
  variants?: ProductVariant[];
  basePrice?: number;
  variantGroups?: VariantGroup[];
};

export type AdminProduct = Product & {
  model?: string;
  description?: string;
  displaySize?: string;
  resolution?: string;
  ports?: string;
  batteryHealth?: number;
  operatingSystem?: string;
  office?: boolean;
  charger?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  featured?: boolean;
  newArrival?: boolean;
  visibility?: "active" | "hidden" | "unavailable";
  coresThreads?: string;
  clockSpeed?: string;
  images?: string[];
  video?: string;
  variants?: ProductVariant[];
  basePrice?: number;
  variantGroups?: VariantGroup[];
};

export type Category = { id: string; name: string; slug: string; order: number; active: boolean };
export type Brand = { id: string; name: string; logo?: string; description?: string; active: boolean };
export type InventoryRecord = {
  id: string;
  productId?: string;
  serial: string;
  supplier: string;
  purchaseDate: string;
  batteryHealth?: number;
  ssdHealth?: number;
  qcStatus: "Pending" | "Passed" | "Failed";
  shelf: string;
  status: "Available" | "Reserved" | "Sold" | "Under Repair";
  remarks?: string;
};
export type ProductVariant = {
  id: string;
  productId: string;
  type: string;
  value: string;
  price: number;
  originalPrice?: number;
  stock: number;
  availability: "In stock" | "Out of stock" | "Low stock";
  sku?: string;
  order: number;
};

// New grouped variant types
export type VariantOption = {
  id: string;
  variantGroupId: string;
  value: string;
  priceAdjustment: number;
  originalPriceAdjustment?: number;
  stock: number;
  availability: "In stock" | "Out of stock" | "Low stock";
  sku?: string;
  order: number;
};

export type VariantGroup = {
  id: string;
  productId: string;
  name: string;
  order: number;
  options: VariantOption[];
};
export type Inquiry = {
  id: string;
  customer: string;
  phone: string;
  productId?: string;
  productName?: string;
  date: string;
  source: "Website" | "Walk-in" | "Phone";
  notes?: string;
  status: "New" | "Contacted" | "Reserved" | "Sold" | "Cancelled";
};
export type Service = {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
};
export type Review = {
  id: string;
  customer: string;
  rating: number;
  text: string;
  date: string;
  status: "Pending" | "Approved" | "Hidden";
  featured: boolean;
};
export type Banner = {
  id: string;
  type: "Homepage Hero" | "Promotional" | "Student Offers" | "Seasonal Sale" | "New Arrivals";
  image?: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
};
export type Homepage = {
  heroHeadline: string;
  heroSubtitle: string;
  heroFeaturedProductId?: string;
  heroFeaturedThumbnail?: string;
  featuredIds: string[];
  why: { title: string; body: string }[];
  testimonialIds: string[];
};
export type Settings = {
  storeName: string;
  logo?: string;
  favicon?: string;
  whatsapp: string;
  phone: string;
  email: string;
  address: string;
  mapsLink: string;
  hours: string;
  social: { facebook: string; instagram: string; youtube: string; linkedin: string; website: string; olx: string };
  seo: { gaId: string; metaTitle: string; metaDescription: string };
};
export type Activity = {
  id: string;
  kind: "product.add" | "product.update" | "inquiry.new" | "review.new" | "banner.update";
  message: string;
  at: string;
};

type AdminState = {
  products: AdminProduct[];
  categories: Category[];
  brands: Brand[];
  variants: ProductVariant[];
  variantGroups: VariantGroup[];
  variantOptions: VariantOption[];
  inventory: InventoryRecord[];
  inquiries: Inquiry[];
  services: Service[];
  reviews: Review[];
  banners: Banner[];
  homepage: Homepage;
  settings: Settings;
  activity: Activity[];
};

// ================ default empty state ================
const defaultHomepage: Homepage = {
  heroHeadline: "",
  heroSubtitle: "",
  heroFeaturedProductId: "dz-thinkpad-x1",
  heroFeaturedThumbnail: "",
  featuredIds: [],
  why: [],
  testimonialIds: [],
};
const defaultSettings: Settings = {
  storeName: "DATAZONe",
  whatsapp: "919999999999",
  phone: "",
  email: "",
  address: "",
  mapsLink: "https://maps.app.goo.gl/mBeM4Nm3r8Ete5WGA",
  hours: "",
  social: { facebook: "", instagram: "", youtube: "", linkedin: "", website: "", olx: "" },
  seo: { gaId: "", metaTitle: "", metaDescription: "" },
};

let state: AdminState = {
  products: [],
  categories: [],
  brands: [],
  variants: [],
  variantGroups: [],
  variantOptions: [],
  inventory: [],
  inquiries: [],
  services: [],
  reviews: [],
  banners: [],
  homepage: defaultHomepage,
  settings: defaultSettings,
  activity: [],
};
const listeners = new Set<() => void>();
function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }
function set(next: Partial<AdminState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

const uid = () => Math.random().toString(36).slice(2, 10);
export const newId = uid;

// ================ row <-> domain mappers ================
type Row = Record<string, any>;

const rowToProduct = (r: Row): AdminProduct => {
  const normalizedImages = (r.images ?? []).map(resolveImage).filter(Boolean);
  const primaryImage = resolveImage(r.image) || normalizedImages[0] || "";
  return {
    id: r.id,
    name: r.name,
    brand: r.brand,
    category: r.category,
    processor: r.processor ?? "",
    ram: r.ram ?? "",
    storage: r.storage ?? "",
    gpu: r.gpu ?? "",
    price: Number(r.price ?? 0),
    original: Number(r.original_price ?? 0),
    condition: r.condition ?? "Grade A",
    availability: r.availability ?? "In stock",
    image: primaryImage,
    tagline: r.tagline ?? "",
    rating: Number(r.rating ?? 4.5),
    reviews: Number(r.reviews ?? 0),
    model: r.model ?? undefined,
    description: r.description ?? undefined,
    displaySize: r.display_size ?? undefined,
    resolution: r.resolution ?? undefined,
    batteryHealth: r.battery_health ?? undefined,
    operatingSystem: r.windows ?? r.operating_system ?? undefined,
    office: r.office ?? false,
    charger: r.charger ?? true,
    slug: r.slug ?? undefined,
    metaTitle: r.meta_title ?? undefined,
    metaDescription: r.meta_description ?? undefined,
    keywords: r.keywords ?? undefined,
    featured: !!r.featured,
    newArrival: !!r.new_arrival,
    visibility: (r.visibility as "active" | "hidden" | "unavailable") ?? (r.active === false ? "hidden" : "active"),
    coresThreads: r.cores_threads ?? undefined,
    clockSpeed: r.clock_speed ?? undefined,
    images: normalizedImages.length ? normalizedImages : primaryImage ? [primaryImage] : [],
    video: r.video ?? undefined,
    variants: [],
    basePrice: r.base_price ? Number(r.base_price) : undefined,
    variantGroups: [],
  };
};
const productToRow = (p: AdminProduct): Row => {
  const images = (p.images ?? []).filter(Boolean);
  const primaryImage = p.image || images[0] || "";
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category,
    processor: p.processor,
    ram: p.ram,
    storage: p.storage,
    gpu: p.gpu,
    price: p.price,
    original_price: p.original,
    condition: p.condition,
    availability: p.availability,
    image: unresolveImage(primaryImage),
    tagline: p.tagline,
    rating: p.rating,
    reviews: p.reviews,
    model: p.model ?? null,
    description: p.description ?? null,
    display_size: p.displaySize ?? null,
    resolution: p.resolution ?? null,
    battery_health: p.batteryHealth ?? null,
    windows: p.operatingSystem ?? null,
    office: !!p.office,
    charger: p.charger !== false,
    slug: p.slug ?? null,
    meta_title: p.metaTitle ?? null,
    meta_description: p.metaDescription ?? null,
    keywords: p.keywords ?? null,
    featured: !!p.featured,
    new_arrival: !!p.newArrival,
    active: p.visibility === "hidden" ? false : true,
    visibility: p.visibility ?? "active",
    cores_threads: p.coresThreads ?? null,
    clock_speed: p.clockSpeed ?? null,
    images: (images.length ? images : primaryImage ? [primaryImage] : []).map(unresolveImage),
    video: p.video ?? null,
    base_price: p.basePrice ?? null,
  };
};

const rowToCategory = (r: Row): Category => ({
  id: r.id, name: r.name, slug: r.slug, order: r.order ?? 0, active: !!r.active,
});
const categoryToRow = (c: Category): Row => ({
  id: c.id, name: c.name, slug: c.slug, order: c.order, active: c.active,
});

const rowToBrand = (r: Row): Brand => ({
  id: r.id, name: r.name, logo: r.logo ?? undefined, description: r.description ?? undefined, active: !!r.active,
});
const brandToRow = (b: Brand): Row => ({
  id: b.id, name: b.name, logo: b.logo ?? null, description: b.description ?? null, active: b.active,
});

const rowToInventory = (r: Row): InventoryRecord => ({
  id: r.id,
  productId: r.product_id ?? undefined,
  serial: r.serial,
  supplier: r.supplier ?? "",
  purchaseDate: r.purchase_date ?? "",
  batteryHealth: r.battery_health ?? undefined,
  ssdHealth: r.ssd_health ?? undefined,
  qcStatus: r.qc_status ?? "Pending",
  shelf: r.shelf ?? "",
  status: r.status ?? "Available",
  remarks: r.remarks ?? "",
});
const inventoryToRow = (i: InventoryRecord): Row => ({
  id: i.id,
  product_id: i.productId ?? null,
  serial: i.serial,
  supplier: i.supplier,
  purchase_date: i.purchaseDate,
  battery_health: i.batteryHealth ?? null,
  ssd_health: i.ssdHealth ?? null,
  qc_status: i.qcStatus,
  shelf: i.shelf,
  status: i.status,
  remarks: i.remarks ?? null,
});

const rowToInquiry = (r: Row): Inquiry => ({
  id: r.id,
  customer: r.customer,
  phone: r.phone ?? "",
  productId: r.product_id ?? undefined,
  productName: r.product_name ?? undefined,
  date: r.date ?? new Date().toISOString(),
  source: r.source ?? "Website",
  notes: r.notes ?? "",
  status: r.status ?? "New",
});
const inquiryToRow = (i: Inquiry): Row => ({
  id: i.id,
  customer: i.customer,
  phone: i.phone,
  product_id: i.productId ?? null,
  product_name: i.productName ?? null,
  date: i.date,
  source: i.source,
  notes: i.notes ?? null,
  status: i.status,
});

const rowToService = (r: Row): Service => ({
  id: r.id, title: r.title, description: r.description ?? "", icon: r.icon ?? "Wrench", featured: !!r.featured, order: r.order ?? 0,
});
const serviceToRow = (s: Service): Row => ({
  id: s.id, title: s.title, description: s.description, icon: s.icon, featured: s.featured, order: s.order,
});

const rowToReview = (r: Row): Review => ({
  id: r.id, customer: r.customer, rating: r.rating ?? 5, text: r.text ?? "",
  date: r.date ?? new Date().toISOString(), status: r.status ?? "Pending", featured: !!r.featured,
});
const reviewToRow = (r: Review): Row => ({
  id: r.id, customer: r.customer, rating: r.rating, text: r.text, date: r.date, status: r.status, featured: r.featured,
});

const rowToBanner = (r: Row): Banner => ({
  id: r.id,
  type: r.type,
  image: resolveImage(r.image) || undefined,
  title: r.title ?? "",
  subtitle: r.subtitle ?? "",
  cta: r.cta ?? "",
  link: r.link ?? "",
  startDate: r.start_date ?? undefined,
  endDate: r.end_date ?? undefined,
  active: !!r.active,
});
const bannerToRow = (b: Banner): Row => ({
  id: b.id,
  type: b.type,
  image: unresolveImage(b.image) || null,
  title: b.title,
  subtitle: b.subtitle,
  cta: b.cta,
  link: b.link,
  start_date: b.startDate ?? null,
  end_date: b.endDate ?? null,
  active: b.active,
});

const rowToHomepage = (r: Row): Homepage => {
  const whyData = r.why;
  let whyList: { title: string; body: string }[] = [];
  let heroFeaturedProductId: string | undefined = undefined;
  let heroFeaturedThumbnail: string | undefined = undefined;

  if (Array.isArray(whyData)) {
    whyList = whyData as { title: string; body: string }[];
  } else if (whyData && typeof whyData === "object") {
    const obj = whyData as Record<string, any>;
    if (Array.isArray(obj.items)) {
      whyList = obj.items;
    }
    if (typeof obj.heroFeaturedProductId === "string") {
      heroFeaturedProductId = obj.heroFeaturedProductId;
    }
    if (typeof obj.heroFeaturedThumbnail === "string") {
      heroFeaturedThumbnail = obj.heroFeaturedThumbnail;
    }
  }

  heroFeaturedProductId = heroFeaturedProductId ?? (r.hero_featured_product_id as string) ?? (r.hero_product_id as string) ?? undefined;
  heroFeaturedThumbnail = heroFeaturedThumbnail ?? (r.hero_featured_thumbnail as string) ?? (r.hero_thumbnail as string) ?? undefined;

  return {
    heroHeadline: r.hero_headline ?? "",
    heroSubtitle: r.hero_subtitle ?? "",
    heroFeaturedProductId,
    heroFeaturedThumbnail,
    featuredIds: r.featured_ids ?? [],
    why: whyList,
    testimonialIds: r.testimonial_ids ?? [],
  };
};

const homepageToRow = (h: Homepage): Row => ({
  id: 1,
  hero_headline: h.heroHeadline,
  hero_subtitle: h.heroSubtitle,
  featured_ids: h.featuredIds,
  testimonial_ids: h.testimonialIds,
  why: {
    items: h.why || [],
    heroFeaturedProductId: h.heroFeaturedProductId ?? null,
    heroFeaturedThumbnail: h.heroFeaturedThumbnail ?? null,
  },
});

const rowToSettings = (r: Row): Settings => ({
  storeName: r.store_name ?? "DATAZONe",
  logo: r.logo ?? undefined,
  favicon: r.favicon ?? undefined,
  whatsapp: r.whatsapp ?? "",
  phone: r.phone ?? "",
  email: r.email ?? "",
  address: r.address ?? "",
  mapsLink: r.maps_link ?? "",
  hours: r.hours ?? "",
  social: r.social ?? defaultSettings.social,
  seo: r.seo ?? defaultSettings.seo,
});
const settingsToRow = (s: Settings): Row => ({
  id: 1,
  store_name: s.storeName,
  logo: s.logo ?? null,
  favicon: s.favicon ?? null,
  whatsapp: s.whatsapp,
  phone: s.phone,
  email: s.email,
  address: s.address,
  maps_link: s.mapsLink,
  hours: s.hours,
  social: s.social,
  seo: s.seo,
});

const rowToActivity = (r: Row): Activity => ({
  id: r.id, kind: r.kind, message: r.message, at: r.at,
});

// ================ hydration ================
let hydrated = false;
let hydratingPromise: Promise<void> | null = null;

async function hydrate() {
  if (hydratingPromise) return hydratingPromise;
  hydratingPromise = (async () => {
    try {
      const [
        p, c, b, inv, inq, s, rv, bn, hp, st, act, v, vg, vo,
      ] = await Promise.all([
        (supabase as any).from("products").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("categories").select("*").order("order", { ascending: true }),
        (supabase as any).from("brands").select("*").order("name", { ascending: true }),
        (supabase as any).from("inventory").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("inquiries").select("*").order("date", { ascending: false }),
        (supabase as any).from("services").select("*").order("order", { ascending: true }),
        (supabase as any).from("reviews").select("*").order("date", { ascending: false }),
        (supabase as any).from("banners").select("*").order("created_at", { ascending: false }),
        (supabase as any).from("homepage").select("*").eq("id", 1).maybeSingle(),
        (supabase as any).from("settings").select("*").eq("id", 1).maybeSingle(),
        (supabase as any).from("activity").select("*").order("at", { ascending: false }).limit(30),
        (supabase as any).from("product_variants").select("*").order("order", { ascending: true }),
        (supabase as any).from("variant_groups").select("*").order("order", { ascending: true }),
        (supabase as any).from("variant_options").select("*").order("order", { ascending: true }),
      ]);
      const variants = (v.data ?? []).map((r: Row): ProductVariant => ({
        id: r.id,
        productId: r.product_id,
        type: r.type,
        value: r.value,
        price: Number(r.price),
        originalPrice: r.original_price ? Number(r.original_price) : undefined,
        stock: Number(r.stock),
        availability: r.availability ?? "In stock",
        sku: r.sku ?? undefined,
        order: Number(r.order ?? 0),
      }));
      const variantGroups = (vg.data ?? []).map((r: Row): VariantGroup => ({
        id: r.id,
        productId: r.product_id,
        name: r.name,
        order: Number(r.order ?? 0),
        options: [],
      }));
      const variantOptions = (vo.data ?? []).map((r: Row): VariantOption => ({
        id: r.id,
        variantGroupId: r.variant_group_id,
        value: r.value,
        priceAdjustment: Number(r.price_adjustment),
        originalPriceAdjustment: r.original_price_adjustment ? Number(r.original_price_adjustment) : undefined,
        stock: Number(r.stock),
        availability: r.availability ?? "In stock",
        sku: r.sku ?? undefined,
        order: Number(r.order ?? 0),
      }));
      // Attach options to groups
      variantGroups.forEach((group: VariantGroup) => {
        group.options = variantOptions.filter((o: VariantOption) => o.variantGroupId === group.id);
      });
      const products = (p.data ?? []).map(rowToProduct);
      // Attach variants to products (old structure for backward compatibility)
      products.forEach((product: AdminProduct) => {
        product.variants = variants.filter((v: ProductVariant) => v.productId === product.id);
        product.variantGroups = variantGroups.filter((g: VariantGroup) => g.productId === product.id);
      });
      set({
        products,
        categories: (c.data ?? []).map(rowToCategory),
        brands: (b.data ?? []).map(rowToBrand),
        variants,
        variantGroups,
        variantOptions,
        inventory: (inv.data ?? []).map(rowToInventory),
        inquiries: (inq.data ?? []).map(rowToInquiry),
        services: (s.data ?? []).map(rowToService),
        reviews: (rv.data ?? []).map(rowToReview),
        banners: (bn.data ?? []).map(rowToBanner),
        homepage: hp.data ? rowToHomepage(hp.data) : defaultHomepage,
        settings: st.data ? rowToSettings(st.data) : defaultSettings,
        activity: (act.data ?? []).map(rowToActivity),
      });
      hydrated = true;
    } catch (err) {
      console.error("[admin-store] hydrate failed", err);
    }
  })();
  return hydratingPromise;
}

// Kick off hydration once, in the browser only.
if (typeof window !== "undefined") {
  hydrate();
}

export function useAdmin<T>(sel: (s: AdminState) => T): T {
  // Ensure hydration is scheduled on mount too (covers hot reload / SSR).
  useEffect(() => {
    if (!hydrated) hydrate();
  }, []);
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(state));
}

export function getAdminState() { return state; }

// ================ activity helper ================
async function pushActivity(a: Omit<Activity, "id" | "at">) {
  const row = { id: uid(), kind: a.kind, message: a.message, at: new Date().toISOString() };
  set({ activity: [{ id: row.id, ...a, at: row.at }, ...state.activity].slice(0, 30) });
  await (supabase as any).from("activity").insert(row);
}

// ================ generic helpers ================
function reportError(err: any, action: string) {
  console.error(`[admin-store] ${action} failed`, err);
  const msg = err?.message ? `${action} failed: ${err.message}` : `${action} failed`;
  if (typeof window !== "undefined") adminToast.error(action, { description: err?.message || "Please try again." });
}

async function upsertRow(table: string, row: Row, action: string) {
  const { error } = await (supabase as any).from(table).upsert(row);
  if (error) reportError(error, action);
  return !error;
}
async function deleteRow(table: string, id: string, action: string) {
  const { error } = await (supabase as any).from(table).delete().eq("id", id);
  if (error) reportError(error, action);
  return !error;
}

// ================ mutations (same API surface) ================
export const admin = {
  reset() {
    // No destructive reset with a real backend; simply re-hydrate from server.
    hydrated = false;
    hydratingPromise = null;
    hydrate();
  },

  // products
  async saveProduct(p: AdminProduct) {
    const images = (p.images ?? []).filter(Boolean);
    const normalized: AdminProduct = {
      ...p,
      image: p.image || images[0] || "",
      images: images.length ? images : p.image ? [p.image] : [],
    };
    const exists = state.products.some((x) => x.id === normalized.id);
    set({ products: exists ? state.products.map((x) => (x.id === normalized.id ? normalized : x)) : [normalized, ...state.products] });
    const ok = await upsertRow("products", productToRow(normalized), "Save product");
    if (ok) {
      // Handle old variants (backward compatibility)
      if (normalized.variants && normalized.variants.length > 0) {
        for (const variant of normalized.variants) {
          const variantRow = {
            id: variant.id,
            product_id: variant.productId,
            type: variant.type,
            value: variant.value,
            price: variant.price,
            original_price: variant.originalPrice ?? null,
            stock: variant.stock,
            availability: variant.availability,
            sku: variant.sku ?? null,
            order: variant.order,
          };
          await upsertRow("product_variants", variantRow, "Save variant");
        }
        const existingVariants = state.variants.filter((v) => v.productId === normalized.id);
        const newVariantIds = normalized.variants.map((v) => v.id);
        const toDelete = existingVariants.filter((v) => !newVariantIds.includes(v.id));
        for (const variantToDelete of toDelete) {
          await deleteRow("product_variants", variantToDelete.id, "Delete variant");
        }
      } else {
        const existingVariants = state.variants.filter((v) => v.productId === normalized.id);
        for (const variantToDelete of existingVariants) {
          await deleteRow("product_variants", variantToDelete.id, "Delete variant");
        }
      }
      // Handle new variant groups
      if (normalized.variantGroups && normalized.variantGroups.length > 0) {
        for (const group of normalized.variantGroups) {
          const groupRow = {
            id: group.id,
            product_id: group.productId,
            name: group.name,
            order: group.order,
          };
          await upsertRow("variant_groups", groupRow, "Save variant group");
          // Save options for this group
          if (group.options && group.options.length > 0) {
            for (const option of group.options) {
              const optionRow = {
                id: option.id,
                variant_group_id: option.variantGroupId,
                value: option.value,
                price_adjustment: option.priceAdjustment,
                original_price_adjustment: option.originalPriceAdjustment ?? null,
                stock: option.stock,
                availability: option.availability,
                sku: option.sku ?? null,
                order: option.order,
              };
              await upsertRow("variant_options", optionRow, "Save variant option");
            }
            // Delete options that are no longer in the group
            const existingOptions = state.variantOptions.filter((o) => o.variantGroupId === group.id);
            const newOptionIds = group.options.map((o) => o.id);
            const toDeleteOptions = existingOptions.filter((o) => !newOptionIds.includes(o.id));
            for (const optionToDelete of toDeleteOptions) {
              await deleteRow("variant_options", optionToDelete.id, "Delete variant option");
            }
          }
        }
        // Delete groups that are no longer in the product
        const existingGroups = state.variantGroups.filter((g) => g.productId === normalized.id);
        const newGroupIds = normalized.variantGroups.map((g) => g.id);
        const toDeleteGroups = existingGroups.filter((g) => !newGroupIds.includes(g.id));
        for (const groupToDelete of toDeleteGroups) {
          // Delete options first (cascade delete should handle this, but being explicit)
          const groupOptions = state.variantOptions.filter((o) => o.variantGroupId === groupToDelete.id);
          for (const optionToDelete of groupOptions) {
            await deleteRow("variant_options", optionToDelete.id, "Delete variant option");
          }
          await deleteRow("variant_groups", groupToDelete.id, "Delete variant group");
        }
      } else {
        // Delete all variant groups for this product if none are provided
        const existingGroups = state.variantGroups.filter((g) => g.productId === normalized.id);
        for (const groupToDelete of existingGroups) {
          const groupOptions = state.variantOptions.filter((o) => o.variantGroupId === groupToDelete.id);
          for (const optionToDelete of groupOptions) {
            await deleteRow("variant_options", optionToDelete.id, "Delete variant option");
          }
          await deleteRow("variant_groups", groupToDelete.id, "Delete variant group");
        }
      }
      pushActivity({ kind: exists ? "product.update" : "product.add", message: `${exists ? "Updated" : "Added"} product "${normalized.name}"` });
    }
    return ok;
  },
  async deleteProduct(id: string) {
    const prev = state.products;
    set({ products: prev.filter((p) => p.id !== id) });
    const ok = await deleteRow("products", id, "Delete product");
    if (ok) {
      // Delete all old variants for this product
      const existingVariants = state.variants.filter((v) => v.productId === id);
      for (const variantToDelete of existingVariants) {
        await deleteRow("product_variants", variantToDelete.id, "Delete variant");
      }
      // Delete all variant groups and options for this product
      const existingGroups = state.variantGroups.filter((g) => g.productId === id);
      for (const groupToDelete of existingGroups) {
        const groupOptions = state.variantOptions.filter((o) => o.variantGroupId === groupToDelete.id);
        for (const optionToDelete of groupOptions) {
          await deleteRow("variant_options", optionToDelete.id, "Delete variant option");
        }
        await deleteRow("variant_groups", groupToDelete.id, "Delete variant group");
      }
    } else {
      set({ products: prev });
    }
    return ok;
  },
  async duplicateProduct(id: string) {
    const src = state.products.find((p) => p.id === id);
    if (!src) return false;
    const copy: AdminProduct = { ...src, id: `${src.id}-copy-${uid()}`, name: `${src.name} (copy)` };
    const ok = await admin.saveProduct(copy);
    if (ok && typeof window !== "undefined") adminToast.info("Product duplicated", { description: "A copy has been created for editing." });
    return ok;
  },

  // variants
  async saveVariant(v: ProductVariant) {
    const exists = state.variants.some((x) => x.id === v.id);
    set({ variants: exists ? state.variants.map((x) => (x.id === v.id ? v : x)) : [...state.variants, v] });
    const row = {
      id: v.id,
      product_id: v.productId,
      type: v.type,
      value: v.value,
      price: v.price,
      original_price: v.originalPrice ?? null,
      stock: v.stock,
      availability: v.availability,
      sku: v.sku ?? null,
      order: v.order,
    };
    const ok = await upsertRow("product_variants", row, "Save variant");
    if (ok) {
      const product = state.products.find((p) => p.id === v.productId);
      if (product) {
        const updatedVariants = exists
          ? product.variants?.map((x) => x.id === v.id ? v : x) || [v]
          : [...(product.variants || []), v];
        set({ products: state.products.map((p) => p.id === v.productId ? { ...p, variants: updatedVariants } : p) });
      }
    }
    return ok;
  },
  async deleteVariant(id: string) {
    const prev = state.variants;
    const variant = state.variants.find((v) => v.id === id);
    set({ variants: prev.filter((v) => v.id !== id) });
    const ok = await deleteRow("product_variants", id, "Delete variant");
    if (!ok) {
      set({ variants: prev });
    } else if (variant) {
      const product = state.products.find((p) => p.id === variant.productId);
      if (product) {
        set({ products: state.products.map((p) => p.id === variant.productId ? { ...p, variants: product.variants?.filter((x) => x.id !== id) } : p) });
      }
    }
    return ok;
  },

  // variant groups
  async saveVariantGroup(g: VariantGroup) {
    const exists = state.variantGroups.some((x) => x.id === g.id);
    set({ variantGroups: exists ? state.variantGroups.map((x) => (x.id === g.id ? g : x)) : [...state.variantGroups, g] });
    const row = {
      id: g.id,
      product_id: g.productId,
      name: g.name,
      order: g.order,
    };
    const ok = await upsertRow("variant_groups", row, "Save variant group");
    if (ok) {
      const product = state.products.find((p) => p.id === g.productId);
      if (product) {
        const updatedGroups = exists
          ? product.variantGroups?.map((x) => x.id === g.id ? g : x) || [g]
          : [...(product.variantGroups || []), g];
        set({ products: state.products.map((p) => p.id === g.productId ? { ...p, variantGroups: updatedGroups } : p) });
      }
    }
    return ok;
  },
  async deleteVariantGroup(id: string) {
    const prev = state.variantGroups;
    const group = state.variantGroups.find((g) => g.id === id);
    set({ variantGroups: prev.filter((g) => g.id !== id) });
    const ok = await deleteRow("variant_groups", id, "Delete variant group");
    if (!ok) {
      set({ variantGroups: prev });
    } else if (group) {
      // Delete all options for this group
      const groupOptions = state.variantOptions.filter((o) => o.variantGroupId === id);
      for (const optionToDelete of groupOptions) {
        await deleteRow("variant_options", optionToDelete.id, "Delete variant option");
      }
      set({ variantOptions: state.variantOptions.filter((o) => o.variantGroupId !== id) });
      const product = state.products.find((p) => p.id === group.productId);
      if (product) {
        set({ products: state.products.map((p) => p.id === group.productId ? { ...p, variantGroups: product.variantGroups?.filter((x) => x.id !== id) } : p) });
      }
    }
    return ok;
  },

  // variant options
  async saveVariantOption(o: VariantOption) {
    const exists = state.variantOptions.some((x) => x.id === o.id);
    set({ variantOptions: exists ? state.variantOptions.map((x) => (x.id === o.id ? o : x)) : [...state.variantOptions, o] });
    const row = {
      id: o.id,
      variant_group_id: o.variantGroupId,
      value: o.value,
      price_adjustment: o.priceAdjustment,
      original_price_adjustment: o.originalPriceAdjustment ?? null,
      stock: o.stock,
      availability: o.availability,
      sku: o.sku ?? null,
      order: o.order,
    };
    const ok = await upsertRow("variant_options", row, "Save variant option");
    if (ok) {
      const group = state.variantGroups.find((g) => g.id === o.variantGroupId);
      if (group) {
        const updatedOptions = exists
          ? group.options?.map((x) => x.id === o.id ? o : x) || [o]
          : [...(group.options || []), o];
        set({ variantGroups: state.variantGroups.map((g) => g.id === o.variantGroupId ? { ...g, options: updatedOptions } : g) });
      }
    }
    return ok;
  },
  async deleteVariantOption(id: string) {
    const prev = state.variantOptions;
    const option = state.variantOptions.find((o) => o.id === id);
    set({ variantOptions: prev.filter((o) => o.id !== id) });
    const ok = await deleteRow("variant_options", id, "Delete variant option");
    if (!ok) {
      set({ variantOptions: prev });
    } else if (option) {
      const group = state.variantGroups.find((g) => g.id === option.variantGroupId);
      if (group) {
        set({ variantGroups: state.variantGroups.map((g) => g.id === option.variantGroupId ? { ...g, options: group.options?.filter((x) => x.id !== id) } : g) });
      }
    }
    return ok;
  },

  // categories
  async saveCategory(c: Category) {
    const exists = state.categories.some((x) => x.id === c.id);
    set({ categories: exists ? state.categories.map((x) => (x.id === c.id ? c : x)) : [...state.categories, c] });
    const ok = await upsertRow("categories", categoryToRow(c), "Save category");
    return ok;
  },
  async deleteCategory(id: string) {
    const prev = state.categories;
    set({ categories: prev.filter((c) => c.id !== id) });
    const ok = await deleteRow("categories", id, "Delete category");
    if (!ok) set({ categories: prev });
    return ok;
  },

  // brands
  async saveBrand(b: Brand) {
    const exists = state.brands.some((x) => x.id === b.id);
    set({ brands: exists ? state.brands.map((x) => (x.id === b.id ? b : x)) : [...state.brands, b] });
    const ok = await upsertRow("brands", brandToRow(b), "Save brand");
    return ok;
  },
  async deleteBrand(id: string) {
    const prev = state.brands;
    set({ brands: prev.filter((b) => b.id !== id) });
    const ok = await deleteRow("brands", id, "Delete brand");
    if (!ok) set({ brands: prev });
    return ok;
  },

  // inventory
  async saveInventory(r: InventoryRecord) {
    const exists = state.inventory.some((x) => x.id === r.id);
    set({ inventory: exists ? state.inventory.map((x) => (x.id === r.id ? r : x)) : [r, ...state.inventory] });
    const ok = await upsertRow("inventory", inventoryToRow(r), "Save inventory");
    return ok;
  },
  async deleteInventory(id: string) {
    const prev = state.inventory;
    set({ inventory: prev.filter((r) => r.id !== id) });
    const ok = await deleteRow("inventory", id, "Delete inventory");
    if (!ok) set({ inventory: prev });
    return ok;
  },

  // inquiries
  async saveInquiry(i: Inquiry) {
    const exists = state.inquiries.some((x) => x.id === i.id);
    set({ inquiries: exists ? state.inquiries.map((x) => (x.id === i.id ? i : x)) : [i, ...state.inquiries] });
    const ok = await upsertRow("inquiries", inquiryToRow(i), "Save inquiry");
    if (ok && !exists) pushActivity({ kind: "inquiry.new", message: `New inquiry from ${i.customer}` });
    return ok;
  },
  async deleteInquiry(id: string) {
    const prev = state.inquiries;
    set({ inquiries: prev.filter((i) => i.id !== id) });
    const ok = await deleteRow("inquiries", id, "Delete inquiry");
    if (!ok) set({ inquiries: prev });
    return ok;
  },

  // services
  async saveService(s: Service) {
    const exists = state.services.some((x) => x.id === s.id);
    set({ services: exists ? state.services.map((x) => (x.id === s.id ? s : x)) : [...state.services, s] });
    const ok = await upsertRow("services", serviceToRow(s), "Save service");
    return ok;
  },
  async deleteService(id: string) {
    const prev = state.services;
    set({ services: prev.filter((s) => s.id !== id) });
    const ok = await deleteRow("services", id, "Delete service");
    if (!ok) set({ services: prev });
    return ok;
  },

  // reviews
  async saveReview(r: Review) {
    const exists = state.reviews.some((x) => x.id === r.id);
    set({ reviews: exists ? state.reviews.map((x) => (x.id === r.id ? r : x)) : [r, ...state.reviews] });
    const ok = await upsertRow("reviews", reviewToRow(r), "Save review");
    return ok;
  },
  async deleteReview(id: string) {
    const prev = state.reviews;
    set({ reviews: prev.filter((r) => r.id !== id) });
    const ok = await deleteRow("reviews", id, "Delete review");
    if (!ok) set({ reviews: prev });
    return ok;
  },

  // banners
  async saveBanner(b: Banner) {
    const exists = state.banners.some((x) => x.id === b.id);
    set({ banners: exists ? state.banners.map((x) => (x.id === b.id ? b : x)) : [b, ...state.banners] });
    const ok = await upsertRow("banners", bannerToRow(b), "Save banner");
    if (ok) pushActivity({ kind: "banner.update", message: `${exists ? "Updated" : "Added"} banner “${b.title}”` });
    return ok;
  },
  async deleteBanner(id: string) {
    const prev = state.banners;
    set({ banners: prev.filter((b) => b.id !== id) });
    const ok = await deleteRow("banners", id, "Delete banner");
    if (!ok) set({ banners: prev });
    return ok;
  },

  // homepage / settings singletons
  async saveHomepage(h: Homepage) {
    set({ homepage: h });
    const ok = await upsertRow("homepage", homepageToRow(h), "Save homepage");
    return ok;
  },
  async saveSettings(s: Settings) {
    set({ settings: s });
    const ok = await upsertRow("settings", settingsToRow(s), "Save settings");
    return ok;
  },
};