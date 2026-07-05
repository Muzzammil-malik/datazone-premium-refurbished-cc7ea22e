import { createFileRoute, Link } from "@tanstack/react-router";
import { inr, useProduct, useProducts, type Product } from "@/lib/products";
import { ShieldCheck, Store, PackageCheck, Star, ArrowRight, Heart, Check, GitCompare, MessageCircle } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { compare, recent, useStore, wishlist } from "@/lib/store";
import { productInquiryUrl } from "@/lib/whatsapp";
import { RecentlyViewed } from "@/components/site/RecentlyViewed";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.id} — DATAZONe` },
      { name: "description", content: "Certified refurbished device from DATAZONe." },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-dz py-40 text-center">
      <div className="eyebrow">Not found</div>
      <h1 className="display-lg mt-3">This product doesn't exist.</h1>
      <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm">
        Back to shop <ArrowRight className="size-4" />
      </Link>
    </div>
  ),
  errorComponent: () => <div className="container-dz py-40 text-center">Something went wrong.</div>,
});

function ProductPage() {
  const { id } = Route.useParams();
  const p = useProduct(id);
  const products = useProducts();
  const wished = useStore((s) => (p ? s.wishlist.includes(p.id) : false));
  const compared = useStore((s) => (p ? s.compare.includes(p.id) : false));
  useEffect(() => { if (p) recent.push(p.id); }, [p?.id]);
  if (!p) {
    return (
      <div className="container-dz py-40 text-center">
        <div className="eyebrow">Loading</div>
        <h1 className="display-lg mt-3">Fetching product…</h1>
      </div>
    );
  }
  const related = products.filter((x: Product) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const off = Math.round(((p.original - p.price) / p.original) * 100);

  return (
    <div className="pb-24">
      <div className="container-dz pt-10">
        <nav className="text-xs text-ink-soft flex gap-2">
          <Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span className="text-foreground">{p.name}</span>
        </nav>
      </div>

      <div className="container-dz mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="relative aspect-square rounded-3xl bg-surface hairline overflow-hidden">
            <img src={p.image} alt={p.name} className="absolute inset-0 h-full w-full object-contain p-10" />
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[p.image, p.image, p.image, p.image].map((src, i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface hairline overflow-hidden">
                <img src={src} alt="" className="h-full w-full object-contain p-2" />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }} className="lg:sticky lg:top-24 self-start">
          <div className="eyebrow">{p.brand} · {p.category}</div>
          <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-tight">{p.name}</h1>
          <p className="mt-3 text-ink-soft text-lg">{p.tagline}</p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`size-3.5 ${i < Math.round(p.rating) ? "fill-foreground" : "text-hairline"}`} strokeWidth={1} />
              ))}
            </div>
            <span className="text-xs text-ink-soft">{p.rating.toFixed(1)} · {p.reviews} reviews</span>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <div className="text-4xl font-bold tracking-tight">{inr(p.price)}</div>
            <div className="pb-1">
              <div className="text-sm text-ink-soft line-through">{inr(p.original)}</div>
              <div className="text-xs font-medium text-[color:var(--accent-blue)]">Save {off}%</div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full hairline px-3 py-1 text-xs">
              <span className="size-1.5 rounded-full bg-[color:var(--success)]" /> {p.availability}
            </span>
            <span className="text-xs px-3 py-1 rounded-full hairline">{p.condition}</span>
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href={productInquiryUrl(p)}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-full bg-foreground text-background py-4 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} /> Order on WhatsApp
            </a>
            <button
              aria-label="Wishlist"
              onClick={() => wishlist.toggle(p.id)}
              className={`grid place-items-center size-[52px] rounded-full hairline transition ${
                wished ? "bg-foreground text-background border-foreground" : "hover:border-foreground"
              }`}
            >
              <Heart className="size-4" strokeWidth={1.5} fill={wished ? "currentColor" : "none"} />
            </button>
            <button
              aria-label="Compare"
              onClick={() => compare.toggle(p.id)}
              className={`grid place-items-center size-[52px] rounded-full hairline transition ${
                compared ? "bg-foreground text-background border-foreground" : "hover:border-foreground"
              }`}
            >
              <GitCompare className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[{ i: ShieldCheck, l: "1-Year Warranty" }, { i: PackageCheck, l: "100-pt Inspected" }, { i: Store, l: "In-store Pickup" }].map(({ i: I, l }) => (
              <div key={l} className="hairline rounded-2xl p-3 flex flex-col items-center text-center gap-2">
                <I className="size-4" strokeWidth={1.5} />
                <span className="text-ink-soft">{l}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 hairline rounded-2xl divide-y divide-hairline">
            {[
              ["Processor", p.processor],
              ["Memory", p.ram],
              ["Storage", p.storage],
              ["Graphics", p.gpu],
              ["Condition", p.condition],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[140px_1fr] gap-4 p-4 text-sm">
                <span className="text-ink-soft">{k}</span>
                <span className="font-medium">{v}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-sm text-ink-soft space-y-2">
            {["Data-wiped and reimaged with a fresh Windows install", "Battery health above 85%", "Ships next business day"].map((l) => (
              <div key={l} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--success)]" /> {l}</div>
            ))}
          </div>
        </motion.div>
      </div>

      {related.length > 0 && (
        <div className="container-dz mt-24">
          <div className="flex items-end justify-between mb-8">
            <h2 className="display-lg">You may also like</h2>
            <Link to="/shop" className="text-sm inline-flex items-center gap-1.5">View all <ArrowRight className="size-4" /></Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r: Product, i: number) => <ProductCard key={r.id} product={r} index={i} />)}
          </div>
        </div>
      )}

      <RecentlyViewed excludeId={p.id} />
    </div>
  );
}