import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/site/ProductCard";
import { useProducts, inr, type Product } from "@/lib/products";
import { SlidersHorizontal, Search, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingAIBot } from "@/components/site/AIBot";

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
  const products = useProducts();
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    if (!prices.length) return { min: 0, max: 200000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  const [q, setQ] = useState("");
  const [brands, setBrands] = useState<string[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [ramSel, setRamSel] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(priceBounds.max);
  const [sort, setSort] = useState<"featured" | "low" | "high" | "rating">("featured");
  const [mobileOpen, setMobileOpen] = useState(false);

  const allBrands = useMemo<string[]>(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const allCats = useMemo<string[]>(() => Array.from(new Set(products.map((p) => p.category))), [products]);
  const allConditions = useMemo<string[]>(() => Array.from(new Set(products.map((p) => p.condition))).sort(), [products]);
  const allRam = ["2 GB", "4 GB", "8 GB", "16 GB", "32 GB"];

  const filtered = useMemo(() => {
    let list = products.filter((p: Product) => {
      if (brands.length && !brands.includes(p.brand)) return false;
      if (cats.length && !cats.includes(p.category)) return false;
      if (conditions.length && !conditions.includes(p.condition)) return false;
      if (ramSel.length) {
        const pRamMatch = ramSel.some((selectedRam) => {
          const num = selectedRam.replace(/\s*GB/i, "").trim();
          const regex = new RegExp(`\\b${num}\\s*GB\\b`, "i");
          return regex.test(p.ram || "");
        });
        if (!pRamMatch) return false;
      }
      if (inStockOnly && p.availability === "Out of stock") return false;
      if (p.price > maxPrice) return false;
      if (q && !`${p.name} ${p.brand} ${p.processor}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
    if (sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [products, q, brands, cats, conditions, ramSel, inStockOnly, maxPrice, sort]);

  const activeCount =
    brands.length +
    cats.length +
    conditions.length +
    ramSel.length +
    (inStockOnly ? 1 : 0) +
    (maxPrice < priceBounds.max ? 1 : 0);

  const clearAll = () => {
    setBrands([]);
    setCats([]);
    setConditions([]);
    setRamSel([]);
    setInStockOnly(false);
    setMaxPrice(priceBounds.max);
  };

  const filters = (
    <FilterPanel
      allBrands={allBrands}
      allCats={allCats}
      allConditions={allConditions}
      allRam={allRam}
      brands={brands}
      setBrands={setBrands}
      cats={cats}
      setCats={setCats}
      conditions={conditions}
      setConditions={setConditions}
      ramSel={ramSel}
      setRamSel={setRamSel}
      inStockOnly={inStockOnly}
      setInStockOnly={setInStockOnly}
      maxPrice={maxPrice}
      setMaxPrice={setMaxPrice}
      priceBounds={priceBounds}
      activeCount={activeCount}
      clearAll={clearAll}
    />
  );

  return (
    <div className="container-dz py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow">Shop</div>
        <h1 className="display-lg mt-3">The collection.</h1>
        <p className="mt-4 text-ink-soft text-lg">Every product inspected, warrantied and ready to work.</p>
      </div>

      <div className="mt-12 grid gap-2 md:grid-cols-[1fr_auto_auto_auto] items-center">
        <div className="relative">
          <Search className="size-4 absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search products, brands, specs…"
            className="w-full hairline rounded-full pl-11 pr-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
          />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden hairline rounded-full px-4 py-2.5 text-xs inline-flex items-center gap-2"
        >
          <SlidersHorizontal className="size-3.5" /> Filters
          {activeCount > 0 && (
            <span className="bg-foreground text-background text-[10px] rounded-full px-1.5 py-0.5">
              {activeCount}
            </span>
          )}
        </button>
        <div className="hairline rounded-full flex items-center px-1 py-1 text-xs">
          <SlidersHorizontal className="size-3.5 mx-3 text-ink-soft" />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-transparent py-2 pr-3 focus:outline-none"
          >
            <option value="featured">Featured</option>
            <option value="low">Price: Low to high</option>
            <option value="high">Price: High to low</option>
            <option value="rating">Top rated</option>
          </select>
        </div>
        <div className="text-xs text-ink-soft">{filtered.length} results</div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[260px_1fr]">
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-8rem)] overflow-y-auto pr-2">
          {filters}
        </aside>

        <div>
          {activeCount > 0 && (
            <ActiveChips
              brands={brands}
              setBrands={setBrands}
              cats={cats}
              setCats={setCats}
              conditions={conditions}
              setConditions={setConditions}
              ramSel={ramSel}
              setRamSel={setRamSel}
              inStockOnly={inStockOnly}
              setInStockOnly={setInStockOnly}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              priceMax={priceBounds.max}
              clearAll={clearAll}
            />
          )}
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-4 text-center py-20 hairline rounded-3xl">
              <div className="text-lg font-medium">No matches</div>
              <div className="mt-2 text-sm text-ink-soft">
                Try a different search or clear the filters.
              </div>
              <button
                onClick={clearAll}
                className="mt-6 rounded-full bg-foreground text-background px-5 py-2 text-xs"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", ease: [0.2, 0.8, 0.2, 1], duration: 0.35 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-y-0 left-0 w-[85%] max-w-sm bg-background border-r border-hairline overflow-y-auto"
            >
              <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-hairline flex items-center justify-between px-5 py-4">
                <div className="text-sm font-semibold">Filters</div>
                <button
                  aria-label="Close filters"
                  onClick={() => setMobileOpen(false)}
                  className="p-1 hover:bg-surface rounded-full"
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="p-5">{filters}</div>
              <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-hairline p-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-full rounded-full bg-foreground text-background py-3 text-sm"
                >
                  Show {filtered.length} results
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingAIBot context={`Currently available products: ${products.slice(0, 15).map(p => `${p.name} - ₹${p.price} (${p.processor}, ${p.ram})`).join(", ")}`} />
    </div>
  );
}

function FilterPanel(props: {
  allBrands: string[];
  allCats: Product["category"][];
  allConditions: string[];
  allRam: string[];
  brands: string[];
  setBrands: (v: string[]) => void;
  cats: string[];
  setCats: (v: string[]) => void;
  conditions: string[];
  setConditions: (v: string[]) => void;
  ramSel: string[];
  setRamSel: (v: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  priceBounds: { min: number; max: number };
  activeCount: number;
  clearAll: () => void;
}) {
  const toggle = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between pb-3 border-b border-hairline">
        <div className="eyebrow">Refine</div>
        {props.activeCount > 0 && (
          <button
            onClick={props.clearAll}
            className="text-[11px] text-ink-soft hover:text-foreground underline underline-offset-4"
          >
            Clear all
          </button>
        )}
      </div>

      <Section title="Category">
        <div className="space-y-2">
          {props.allCats.map((c) => (
            <Check
              key={c}
              label={c}
              checked={props.cats.includes(c)}
              onChange={() => toggle(props.cats, props.setCats, c)}
            />
          ))}
        </div>
      </Section>

      <Section title="Brand">
        <div className="space-y-2">
          {props.allBrands.map((b) => (
            <Check
              key={b}
              label={b}
              checked={props.brands.includes(b)}
              onChange={() => toggle(props.brands, props.setBrands, b)}
            />
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="px-1">
          <input
            type="range"
            min={props.priceBounds.min}
            max={props.priceBounds.max}
            step={1000}
            value={props.maxPrice}
            onChange={(e) => props.setMaxPrice(Number(e.target.value))}
            className="w-full accent-foreground"
          />
          <div className="mt-2 flex items-center justify-between text-[11px] text-ink-soft">
            <span>{inr(props.priceBounds.min)}</span>
            <span className="text-foreground font-medium">Up to {inr(props.maxPrice)}</span>
          </div>
        </div>
      </Section>

      <Section title="Condition">
        <div className="space-y-2">
          {props.allConditions.map((c) => (
            <Check
              key={c}
              label={c}
              checked={props.conditions.includes(c)}
              onChange={() => toggle(props.conditions, props.setConditions, c)}
            />
          ))}
        </div>
      </Section>

      {props.allRam.length > 0 && (
        <Section title="RAM">
          <div className="flex flex-wrap gap-1.5">
            {props.allRam.map((r) => {
              const active = props.ramSel.includes(r);
              return (
                <button
                  key={r}
                  onClick={() => toggle(props.ramSel, props.setRamSel, r)}
                  className={`text-[11px] px-3 py-1.5 rounded-full transition ${
                    active ? "bg-foreground text-background" : "hairline hover:border-foreground"
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </Section>
      )}

      <Section title="Availability" defaultOpen>
        <label className="flex items-center justify-between cursor-pointer text-sm">
          <span>In stock only</span>
          <span
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
              props.inStockOnly ? "bg-foreground" : "bg-surface hairline"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={props.inStockOnly}
              onChange={(e) => props.setInStockOnly(e.target.checked)}
            />
            <span
              className={`inline-block size-3.5 rounded-full bg-background transition ${
                props.inStockOnly ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </span>
        </label>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-hairline py-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-xs uppercase tracking-wider text-ink-soft hover:text-foreground transition"
      >
        <span>{title}</span>
        <ChevronDown
          className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="pt-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Check({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer text-sm group">
      <span
        className={`grid place-items-center size-4 rounded border transition ${
          checked
            ? "bg-foreground border-foreground text-background"
            : "border-hairline group-hover:border-foreground"
        }`}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="size-2.5" fill="none">
            <path
              d="M2 6.5 5 9.5 10 3"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className="flex-1">{label}</span>
    </label>
  );
}

function ActiveChips(props: {
  brands: string[];
  setBrands: (v: string[]) => void;
  cats: string[];
  setCats: (v: string[]) => void;
  conditions: string[];
  setConditions: (v: string[]) => void;
  ramSel: string[];
  setRamSel: (v: string[]) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  priceMax: number;
  clearAll: () => void;
}) {
  const rm = (list: string[], set: (v: string[]) => void, v: string) =>
    set(list.filter((x) => x !== v));

  const chips: { key: string; label: string; onRemove: () => void }[] = [
    ...props.cats.map((v) => ({ key: `c-${v}`, label: v, onRemove: () => rm(props.cats, props.setCats, v) })),
    ...props.brands.map((v) => ({ key: `b-${v}`, label: v, onRemove: () => rm(props.brands, props.setBrands, v) })),
    ...props.conditions.map((v) => ({ key: `cd-${v}`, label: v, onRemove: () => rm(props.conditions, props.setConditions, v) })),
    ...props.ramSel.map((v) => ({ key: `r-${v}`, label: v, onRemove: () => rm(props.ramSel, props.setRamSel, v) })),
  ];
  if (props.inStockOnly)
    chips.push({ key: "stock", label: "In stock only", onRemove: () => props.setInStockOnly(false) });
  if (props.maxPrice < props.priceMax)
    chips.push({
      key: "price",
      label: `≤ ${inr(props.maxPrice)}`,
      onRemove: () => props.setMaxPrice(props.priceMax),
    });

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <button
          key={c.key}
          onClick={c.onRemove}
          className="inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full bg-surface hairline hover:border-foreground transition"
        >
          {c.label}
          <X className="size-3" />
        </button>
      ))}
      <button
        onClick={props.clearAll}
        className="text-[11px] text-ink-soft hover:text-foreground underline underline-offset-4 ml-1"
      >
        Clear all
      </button>
    </div>
  );
}