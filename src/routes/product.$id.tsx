import { createFileRoute, Link } from "@tanstack/react-router";
import { inr, useProduct, useProducts, type Product } from "@/lib/products";
import { ShieldCheck, Store, PackageCheck, Star, ArrowRight, Heart, Check, GitCompare, MessageCircle, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
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
  const [activeImage, setActiveImage] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "50% 50%" });
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [expandedDescription, setExpandedDescription] = useState(false);
  const galleryRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { if (p) recent.push(p.id); }, [p?.id]);
  const gallery = useMemo(() => {
    const list = (p?.images && p.images.length ? p.images : p?.image ? [p.image] : []).filter(Boolean);
    return list.length ? list : [""];
  }, [p]);

  useEffect(() => {
    setActiveImage(0);
  }, [p?.id]);

  // Group variants by type and auto-select first option
  const variantGroups = useMemo(() => {
    if (!p?.variants || p.variants.length === 0) return [];
    const groups: Record<string, typeof p.variants> = {};
    p.variants.forEach((v) => {
      if (!groups[v.type]) groups[v.type] = [];
      groups[v.type].push(v);
    });
    return Object.entries(groups).map(([type, variants]) => ({
      type,
      variants: variants.sort((a, b) => a.order - b.order),
    }));
  }, [p?.variants]);

  // Auto-select first variant of each type
  useEffect(() => {
    if (variantGroups.length > 0) {
      const autoSelected: Record<string, string> = {};
      variantGroups.forEach((group) => {
        if (group.variants.length > 0 && !selectedVariants[group.type]) {
          autoSelected[group.type] = group.variants[0].id;
        }
      });
      if (Object.keys(autoSelected).length > 0) {
        setSelectedVariants((prev) => ({ ...prev, ...autoSelected }));
      }
    }
  }, [variantGroups, p?.id]);

  // Calculate price based on selected variants (sum of all selected variant prices)
  const currentPrice = useMemo(() => {
    if (!p?.variants || p.variants.length === 0) return p?.price || 0;
    const selectedVariantIds = Object.values(selectedVariants);
    if (selectedVariantIds.length === 0) return p?.price || 0;
    const selectedVariantsList = p.variants.filter((v) => selectedVariantIds.includes(v.id));
    if (selectedVariantsList.length === 0) return p?.price || 0;
    const variantsPriceSum = selectedVariantsList.reduce((sum, v) => sum + v.price, 0);
    return variantsPriceSum;
  }, [p?.variants, selectedVariants, p?.price]);

  const currentOriginalPrice = useMemo(() => {
    if (!p?.variants || p.variants.length === 0) return p?.original || 0;
    const selectedVariantIds = Object.values(selectedVariants);
    if (selectedVariantIds.length === 0) return p?.original || 0;
    const selectedVariantsList = p.variants.filter((v) => selectedVariantIds.includes(v.id));
    if (selectedVariantsList.length === 0) return p?.original || 0;
    const variantsOriginalPriceSum = selectedVariantsList.reduce((sum, v) => sum + (v.originalPrice || 0), 0);
    return variantsOriginalPriceSum || p?.original || 0;
  }, [p?.variants, selectedVariants, p?.original]);

  if (!p) {
    return (
      <div className="container-dz py-40 text-center">
        <div className="eyebrow">Loading</div>
        <h1 className="display-lg mt-3">Fetching product…</h1>
      </div>
    );
  }
  const related = products.filter((x: Product) => x.id !== p.id && x.category === p.category).slice(0, 4);
  const off = Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100);
  const mainImage = gallery[activeImage] || p.image;

  const prevImage = () => setActiveImage((v) => (v === 0 ? gallery.length - 1 : v - 1));
  const nextImage = () => setActiveImage((v) => (v === gallery.length - 1 ? 0 : v + 1));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomStyle({ transform: "scale(1.8)", transformOrigin: `${x}% ${y}%` });
  };

  const handleMouseLeave = () => setZoomStyle({ transform: "scale(1)", transformOrigin: "50% 50%" });

  return (
    <div className="pb-24">
      <div className="container-dz pt-10">
        <nav className="text-xs text-ink-soft flex gap-2">
          <Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span className="text-foreground">{p.name}</span>
        </nav>
      </div>

      <div className="container-dz mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="relative aspect-square rounded-3xl bg-surface hairline overflow-hidden" ref={galleryRef}>
            <div
              className="absolute inset-0 overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage}
                alt={p.name}
                className="absolute inset-0 h-full w-full object-contain p-10 transition duration-300 ease-out"
                style={zoomStyle}
              />
            </div>
            {gallery.length > 1 && (
              <>
                <button type="button" onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 rounded-full bg-background/80 backdrop-blur border">
                  <ChevronLeft className="size-4" />
                </button>
                <button type="button" onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 grid place-items-center size-10 rounded-full bg-background/80 backdrop-blur border">
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}
            <div className="absolute bottom-3 right-3 z-10 rounded-full bg-background/80 backdrop-blur px-2.5 py-1 text-[11px] border flex items-center gap-1">
              <ZoomIn className="size-3.5" /> Hover to zoom
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {gallery.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setActiveImage(i)}
                className={`aspect-square rounded-xl bg-surface hairline overflow-hidden border transition ${activeImage === i ? "border-foreground" : "border-transparent"}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-2" />
              </button>
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

          {p.visibility === "unavailable" ? (
            <div className="mt-8">
              <div className="text-2xl font-bold tracking-tight text-destructive">CURRENTLY UNAVAILABLE</div>
              <p className="mt-2 text-sm text-ink-soft">This product is currently unavailable. Please check back later.</p>
            </div>
          ) : (
            <>
              <div className="mt-8 flex items-end gap-4">
                <div className="text-4xl font-bold tracking-tight">{inr(currentPrice)}</div>
                <div className="pb-1">
                  <div className="text-sm text-ink-soft line-through">{inr(currentOriginalPrice)}</div>
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
                  href={productInquiryUrl(p, 1, Object.values(selectedVariants))}
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
            </>
          )}

          <div className="mt-8 grid grid-cols-3 gap-3 text-xs">
            {[{ i: ShieldCheck, l: "1-Month Warranty" }, { i: PackageCheck, l: "100-pt Inspected" }, { i: Store, l: "In-store Pickup" }].map(({ i: I, l }) => (
              <div key={l} className="hairline rounded-2xl p-3 flex flex-col items-center text-center gap-2">
                <I className="size-4" strokeWidth={1.5} />
                <span className="text-ink-soft">{l}</span>
              </div>
            ))}
          </div>

          {p.description && (
            <div className="mt-6 rounded-lg bg-surface/50 px-4 py-3">
              <p className={`text-sm text-ink-soft leading-relaxed ${expandedDescription ? "" : "line-clamp-2"}`}>
                {p.description}
              </p>
              {p.description.length > 100 && (
                <button
                  type="button"
                  onClick={() => setExpandedDescription(!expandedDescription)}
                  className="mt-2 text-xs text-foreground hover:underline"
                >
                  {expandedDescription ? "Show less" : "Read more"}
                </button>
              )}
            </div>
          )}

          {variantGroups.length > 0 && (
            <div className="mt-6 space-y-4">
              {variantGroups.map((group) => (
                <div key={group.type}>
                  <div className="text-xs font-medium text-ink-soft mb-2">{group.type}</div>
                  <div className="flex flex-wrap gap-2">
                    {group.variants.map((variant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariants((prev) => ({ ...prev, [group.type]: variant.id }))}
                        className={`px-4 py-2 rounded-full text-sm border transition ${
                          selectedVariants[group.type] === variant.id
                            ? "bg-foreground text-background border-foreground"
                            : "bg-background border-hairline hover:border-foreground"
                        }`}
                      >
                        {variant.value}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 hairline rounded-2xl divide-y divide-hairline">
            {(() => {
              const specs: [string, string | number | undefined][] = [];
              
              if (p.category === "Monitors") {
                if ((p as any).displaySize) specs.push(["Display Size", (p as any).displaySize]);
                if ((p as any).resolution) specs.push(["Resolution", (p as any).resolution]);
                if ((p as any).ports) specs.push(["Ports", (p as any).ports]);
              } else {
                if (p.processor) specs.push(["Processor", p.processor]);
                if ((p as any).coresThreads) specs.push(["Cores / Threads", (p as any).coresThreads]);
                if ((p as any).clockSpeed) specs.push(["Clock Speed", (p as any).clockSpeed]);
                if (p.ram) specs.push(["Memory", p.ram]);
                if (p.storage) specs.push(["Storage", p.storage]);
                if (p.gpu) specs.push(["Graphics", p.gpu]);
                if ((p as any).displaySize) specs.push(["Display Size", (p as any).displaySize]);
                if ((p as any).resolution) specs.push(["Resolution", (p as any).resolution]);
                if ((p as any).batteryHealth) specs.push(["Battery Health", `${(p as any).batteryHealth}%`]);
                if ((p as any).operatingSystem) specs.push(["Operating System", (p as any).operatingSystem]);
              }
              
              specs.push(["Condition", p.condition]);
              
              return specs.filter(([_, v]) => v).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[140px_1fr] gap-4 p-4 text-sm">
                  <span className="text-ink-soft">{k}</span>
                  <span className="font-medium">{v}</span>
                </div>
              ));
            })()}
          </div>

          <div className="mt-6 text-sm text-ink-soft space-y-2">
            {["Data-wiped and reimaged with a fresh Windows install"].map((l) => (
              <div key={l} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--success)]" /> {l}</div>
            ))}
          </div>
          <div className="mt-6 text-sm text-ink-soft space-y-2">
            {["Geniune and Lifetime activated windows"].map((l) => (
              <div key={l} className="flex items-center gap-2"><Check className="size-4 text-[color:var(--success)]" /> {l}</div>
            ))}
          </div>
          <div className="mt-6 text-sm text-ink-soft space-y-2">
            {["Storage and RAM are upgradable anytime"].map((l) => (
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