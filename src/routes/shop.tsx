import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { products } from "@/lib/products";
import { SlidersHorizontal, Search } from "lucide-react";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — DATAZONe Refurbished Computers" },
      { name: "description", content: "Browse refurbished laptops, desktops, monitors and accessories. Filter by brand, condition, RAM, storage and more." },
      { property: "og:title", content: "Shop — DATAZONe" },
      { property: "og:description", content: "Certified refurbished computers with warranty." },
    ],
  }),
  component: Shop,
});

function Shop() {
  const [q, setQ] = useState("");
  const [brand, setBrand] = useState<string | null>(null);
  const [cat, setCat] = useState<string | null>(null);
  const [sort, setSort] = useState<"featured" | "low" | "high">("featured");

  const brands = Array.from(new Set(products.map((p) => p.brand)));
  const cats = Array.from(new Set(products.map((p) => p.category)));

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (brand && p.brand !== brand) return false;
      if (cat && p.category !== cat) return false;
      if (q && !`${p.name} ${p.brand} ${p.processor}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [q, brand, cat, sort]);

  return (
    <div className="container-dz py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow">Shop</div>
        <h1 className="display-lg mt-3">The collection.</h1>
        <p className="mt-4 text-ink-soft text-lg">Every product inspected, warrantied and ready to work.</p>
      </div>

      <div className="mt-12 grid gap-2 md:grid-cols-[1fr_auto_auto] items-center">
        <div className="relative">
          <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brands, specs…"
            className="w-full hairline rounded-full pl-11 pr-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
          />
        </div>
        <div className="hairline rounded-full flex items-center px-1 py-1 text-xs">
          <SlidersHorizontal className="size-3.5 mx-3 text-ink-soft" />
          <select value={sort} onChange={(e) => setSort(e.target.value as "featured" | "low" | "high")} className="bg-transparent py-2 pr-3 focus:outline-none">
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
          </select>
        </div>
        <div className="text-xs text-ink-soft">{filtered.length} results</div>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Chip active={!cat} onClick={() => setCat(null)}>All categories</Chip>
        {cats.map((c) => <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>{c}</Chip>)}
        <div className="w-px bg-hairline mx-2 hidden md:block" />
        <Chip active={!brand} onClick={() => setBrand(null)}>All brands</Chip>
        {brands.map((b) => <Chip key={b} active={brand === b} onClick={() => setBrand(brand === b ? null : b)}>{b}</Chip>)}
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
      {filtered.length === 0 && (
        <div className="mt-16 text-center py-20 hairline rounded-3xl">
          <div className="text-lg font-medium">No matches</div>
          <div className="mt-2 text-sm text-ink-soft">Try a different search or clear the filters.</div>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-4 py-2 rounded-full transition ${active ? "bg-foreground text-background" : "hairline hover:border-foreground"}`}
    >
      {children}
    </button>
  );
}