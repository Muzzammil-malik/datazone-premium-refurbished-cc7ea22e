import { useSyncExternalStore } from "react";
import { products as seedProducts, type Product } from "./products";

export type AdminProduct = Product & {
  model?: string;
  description?: string;
  displaySize?: string;
  resolution?: string;
  batteryHealth?: number;
  windows?: string;
  office?: boolean;
  charger?: boolean;
  slug?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  featured?: boolean;
  newArrival?: boolean;
  active?: boolean;
  images?: string[];
  video?: string;
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
  social: { facebook: string; instagram: string; youtube: string; linkedin: string; website: string };
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
  inventory: InventoryRecord[];
  inquiries: Inquiry[];
  services: Service[];
  reviews: Review[];
  banners: Banner[];
  homepage: Homepage;
  settings: Settings;
  activity: Activity[];
};

const KEY = "datazone.admin.v1";

const uid = () => Math.random().toString(36).slice(2, 10);

function seed(): AdminState {
  const cats: Category[] = ["Laptops", "Desktops", "Workstations", "Monitors", "Accessories"].map((n, i) => ({
    id: uid(), name: n, slug: n.toLowerCase(), order: i, active: true,
  }));
  const brandNames = Array.from(new Set(seedProducts.map((p) => p.brand)));
  const brands: Brand[] = ["Dell", "HP", "Lenovo", "ASUS", "Apple", "Acer", "MSI", ...brandNames]
    .filter((v, i, a) => a.indexOf(v) === i)
    .map((n) => ({ id: uid(), name: n, description: `${n} certified refurbished lineup.`, active: true }));

  const products: AdminProduct[] = seedProducts.map((p) => ({
    ...p,
    slug: p.id,
    active: true,
    featured: Math.random() > 0.5,
    newArrival: Math.random() > 0.6,
    images: [p.image],
    description: p.tagline,
  }));

  const inventory: InventoryRecord[] = products.slice(0, 5).map((p, i) => ({
    id: uid(),
    productId: p.id,
    serial: `DZ-${(1000 + i).toString()}-${p.brand.slice(0, 3).toUpperCase()}`,
    supplier: ["TechRecycle Ltd", "GreenIT Traders", "Corporate Buyback Co"][i % 3],
    purchaseDate: new Date(Date.now() - i * 86400000 * 7).toISOString().slice(0, 10),
    batteryHealth: 82 + i,
    ssdHealth: 94 + i,
    qcStatus: "Passed",
    shelf: `A-${i + 1}`,
    status: (["Available", "Reserved", "Available", "Sold", "Under Repair"] as const)[i],
    remarks: "",
  }));

  const inquiries: Inquiry[] = [
    { id: uid(), customer: "Rahul Sharma", phone: "+91 98765 43210", productId: products[0]?.id, productName: products[0]?.name, date: new Date().toISOString(), source: "Website", status: "New", notes: "Asked about warranty." },
    { id: uid(), customer: "Priya Patel", phone: "+91 98123 45566", productId: products[1]?.id, productName: products[1]?.name, date: new Date(Date.now() - 3600_000).toISOString(), source: "Website", status: "Contacted" },
    { id: uid(), customer: "Aman Verma", phone: "+91 90000 12345", productId: products[2]?.id, productName: products[2]?.name, date: new Date(Date.now() - 86400_000).toISOString(), source: "Walk-in", status: "Reserved" },
    { id: uid(), customer: "Neha Iyer", phone: "+91 90876 54321", productId: products[3]?.id, productName: products[3]?.name, date: new Date(Date.now() - 2 * 86400_000).toISOString(), source: "Phone", status: "Sold" },
  ];

  const services: Service[] = [
    { id: uid(), title: "Laptop Repair", description: "Board-level diagnostics, screen and keyboard replacements.", icon: "Wrench", featured: true, order: 0 },
    { id: uid(), title: "Desktop Repair", description: "PSU, motherboard, cooling and cabling fixes.", icon: "Cpu", featured: true, order: 1 },
    { id: uid(), title: "SSD Upgrade", description: "Fast NVMe / SATA SSD upgrades with data migration.", icon: "HardDrive", featured: false, order: 2 },
    { id: uid(), title: "RAM Upgrade", description: "Compatible DDR4 / DDR5 modules with warranty.", icon: "MemoryStick", featured: false, order: 3 },
    { id: uid(), title: "Windows Installation", description: "Genuine Windows 10 / 11 setup with drivers.", icon: "Monitor", featured: false, order: 4 },
    { id: uid(), title: "Virus Removal", description: "Complete malware cleanup and hardening.", icon: "Shield", featured: false, order: 5 },
    { id: uid(), title: "Data Recovery", description: "Recover files from failing SSDs and HDDs.", icon: "Database", featured: false, order: 6 },
  ];

  const reviews: Review[] = [
    { id: uid(), customer: "Karan M.", rating: 5, text: "Excellent condition, delivered in perfect shape.", date: new Date().toISOString(), status: "Approved", featured: true },
    { id: uid(), customer: "Sneha R.", rating: 5, text: "Fantastic value. Feels almost brand new.", date: new Date().toISOString(), status: "Approved", featured: true },
    { id: uid(), customer: "Vikram S.", rating: 4, text: "Great service. Would buy again.", date: new Date().toISOString(), status: "Pending", featured: false },
  ];

  const banners: Banner[] = [
    { id: uid(), type: "Homepage Hero", title: "Premium refurbished. Zero compromise.", subtitle: "100-point inspection. Warranty included.", cta: "Shop laptops", link: "/shop", active: true },
    { id: uid(), type: "Student Offers", title: "Student savings on ThinkPads", subtitle: "From ₹32,999 with warranty.", cta: "Explore", link: "/shop", active: true },
  ];

  const homepage: Homepage = {
    heroHeadline: "Premium refurbished computers. Trusted.",
    heroSubtitle: "Certified refurbished laptops, desktops and monitors — inspected, warrantied, delivered.",
    featuredIds: products.slice(0, 4).map((p) => p.id),
    why: [
      { title: "100-point inspection", body: "Every unit tested end-to-end before it ships." },
      { title: "6-month warranty", body: "Peace of mind on every purchase, standard." },
      { title: "Expert support", body: "Real humans, ready to help via WhatsApp." },
    ],
    testimonialIds: reviews.filter((r) => r.featured).map((r) => r.id),
  };

  const settings: Settings = {
    storeName: "DATAZONe",
    whatsapp: "919999999999",
    phone: "+91 99999 99999",
    email: "hello@datazone.in",
    address: "DATAZONe HQ, MG Road, Bengaluru 560001",
    mapsLink: "https://maps.google.com",
    hours: "Mon–Sat, 10:00 – 19:00",
    social: { facebook: "", instagram: "", youtube: "", linkedin: "", website: "" },
    seo: { gaId: "", metaTitle: "DATAZONe — Premium Refurbished Computers", metaDescription: "Refurbished laptops, desktops and monitors — inspected, warrantied." },
  };

  const activity: Activity[] = [
    { id: uid(), kind: "product.add", message: `Added product “${products[0]?.name}”`, at: new Date().toISOString() },
    { id: uid(), kind: "inquiry.new", message: `New WhatsApp inquiry from ${inquiries[0].customer}`, at: new Date().toISOString() },
    { id: uid(), kind: "review.new", message: `Review submitted by ${reviews[0].customer}`, at: new Date().toISOString() },
    { id: uid(), kind: "banner.update", message: `Updated banner “${banners[0].title}”`, at: new Date().toISOString() },
  ];

  return { products, categories: cats, brands, inventory, inquiries, services, reviews, banners, homepage, settings, activity };
}

let state: AdminState = seed();
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...state, ...JSON.parse(raw) };
  } catch {}
}
load();

function persist() {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

function commit(next: Partial<AdminState>, activity?: Activity) {
  state = { ...state, ...next };
  if (activity) state = { ...state, activity: [activity, ...state.activity].slice(0, 30) };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb); }

export function useAdmin<T>(sel: (s: AdminState) => T): T {
  return useSyncExternalStore(subscribe, () => sel(state), () => sel(state));
}

export function getAdminState() { return state; }

export const admin = {
  reset() { state = seed(); persist(); listeners.forEach((l) => l()); },

  // products
  saveProduct(p: AdminProduct) {
    const exists = state.products.some((x) => x.id === p.id);
    const products = exists ? state.products.map((x) => (x.id === p.id ? p : x)) : [p, ...state.products];
    commit({ products }, {
      id: uid(),
      kind: exists ? "product.update" : "product.add",
      message: `${exists ? "Updated" : "Added"} product “${p.name}”`,
      at: new Date().toISOString(),
    });
  },
  deleteProduct(id: string) {
    commit({ products: state.products.filter((p) => p.id !== id) });
  },
  duplicateProduct(id: string) {
    const src = state.products.find((p) => p.id === id);
    if (!src) return;
    const copy: AdminProduct = { ...src, id: `${src.id}-copy-${uid()}`, name: `${src.name} (copy)` };
    commit({ products: [copy, ...state.products] });
  },

  // categories
  saveCategory(c: Category) {
    const exists = state.categories.some((x) => x.id === c.id);
    commit({ categories: exists ? state.categories.map((x) => (x.id === c.id ? c : x)) : [...state.categories, c] });
  },
  deleteCategory(id: string) { commit({ categories: state.categories.filter((c) => c.id !== id) }); },

  // brands
  saveBrand(b: Brand) {
    const exists = state.brands.some((x) => x.id === b.id);
    commit({ brands: exists ? state.brands.map((x) => (x.id === b.id ? b : x)) : [...state.brands, b] });
  },
  deleteBrand(id: string) { commit({ brands: state.brands.filter((b) => b.id !== id) }); },

  // inventory
  saveInventory(r: InventoryRecord) {
    const exists = state.inventory.some((x) => x.id === r.id);
    commit({ inventory: exists ? state.inventory.map((x) => (x.id === r.id ? r : x)) : [r, ...state.inventory] });
  },
  deleteInventory(id: string) { commit({ inventory: state.inventory.filter((r) => r.id !== id) }); },

  // inquiries
  saveInquiry(i: Inquiry) {
    const exists = state.inquiries.some((x) => x.id === i.id);
    commit({ inquiries: exists ? state.inquiries.map((x) => (x.id === i.id ? i : x)) : [i, ...state.inquiries] },
      exists ? undefined : { id: uid(), kind: "inquiry.new", message: `New inquiry from ${i.customer}`, at: new Date().toISOString() });
  },
  deleteInquiry(id: string) { commit({ inquiries: state.inquiries.filter((i) => i.id !== id) }); },

  // services
  saveService(s: Service) {
    const exists = state.services.some((x) => x.id === s.id);
    commit({ services: exists ? state.services.map((x) => (x.id === s.id ? s : x)) : [...state.services, s] });
  },
  deleteService(id: string) { commit({ services: state.services.filter((s) => s.id !== id) }); },

  // reviews
  saveReview(r: Review) {
    const exists = state.reviews.some((x) => x.id === r.id);
    commit({ reviews: exists ? state.reviews.map((x) => (x.id === r.id ? r : x)) : [r, ...state.reviews] });
  },
  deleteReview(id: string) { commit({ reviews: state.reviews.filter((r) => r.id !== id) }); },

  // banners
  saveBanner(b: Banner) {
    const exists = state.banners.some((x) => x.id === b.id);
    commit({ banners: exists ? state.banners.map((x) => (x.id === b.id ? b : x)) : [b, ...state.banners] },
      { id: uid(), kind: "banner.update", message: `${exists ? "Updated" : "Added"} banner “${b.title}”`, at: new Date().toISOString() });
  },
  deleteBanner(id: string) { commit({ banners: state.banners.filter((b) => b.id !== id) }); },

  // homepage / settings
  saveHomepage(h: Homepage) { commit({ homepage: h }); },
  saveSettings(s: Settings) { commit({ settings: s }); },
};

export const newId = uid;