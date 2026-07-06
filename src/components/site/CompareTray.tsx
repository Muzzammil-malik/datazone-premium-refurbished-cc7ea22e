import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { compare, drawers, useStore, useUI } from "@/lib/store";
import { getProduct, inr, useProducts } from "@/lib/products";
import { GitCompare, X, MessageCircle, Check, Minus, ShoppingBag } from "lucide-react";
import { productInquiryUrl } from "@/lib/whatsapp";
import { cart } from "@/lib/store";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment } from "react";

export function CompareBar() {
  const ids = useStore((s) => s.compare);
  useProducts();
  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
        >
          <div className="hairline rounded-full bg-background/95 backdrop-blur-xl shadow-2xl px-3 py-2 flex items-center gap-3">
            <div className="flex items-center gap-1.5 pl-2 pr-1">
              <GitCompare className="size-4" strokeWidth={1.5} />
              <span className="text-xs font-medium">Compare</span>
            </div>
            <div className="flex items-center gap-1.5">
              {ids.map((id) => {
                const p = getProduct(id);
                if (!p) return null;
                return (
                  <div key={id} className="relative size-10 rounded-lg bg-surface hairline overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-contain p-1" />
                    <button
                      aria-label="Remove"
                      onClick={() => compare.remove(id)}
                      className="absolute -top-1 -right-1 grid place-items-center size-4 rounded-full bg-foreground text-background"
                    >
                      <X className="size-2.5" />
                    </button>
                  </div>
                );
              })}
              {Array.from({ length: Math.max(0, 2 - ids.length) }).map((_, i) => (
                <div key={i} className="size-10 rounded-lg border border-dashed border-hairline" />
              ))}
            </div>
            <button
              disabled={ids.length < 2}
              onClick={() => drawers.openCompare()}
              className="rounded-full bg-foreground text-background px-4 py-2 text-xs font-medium disabled:opacity-40"
            >
              Compare {ids.length}
            </button>
            <button
              aria-label="Clear"
              onClick={() => compare.clear()}
              className="p-2 text-ink-soft hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CompareDrawer() {
  const open = useUI((u) => u.compareOpen);
  const ids = useStore((s) => s.compare);
  useProducts();
  const items = ids.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];

  const groups: { section: string; rows: { label: string; key: keyof (typeof items)[number] }[] }[] = [
    {
      section: "Overview",
      rows: [
        { label: "Brand", key: "brand" },
        { label: "Category", key: "category" },
        { label: "Condition", key: "condition" },
        { label: "Availability", key: "availability" },
      ],
    },
    {
      section: "Performance",
      rows: [
        { label: "Processor", key: "processor" },
        { label: "Memory", key: "ram" },
        { label: "Storage", key: "storage" },
        { label: "Graphics", key: "gpu" },
      ],
    },
  ];

  // For each row, find the value(s) that differ so we can highlight them.
  const isBest = (key: string, value: unknown) => {
    const vals = items.map((p) => (p as any)[key]);
    const uniq = new Set(vals.map(String));
    return uniq.size > 1;
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? drawers.openCompare() : drawers.closeCompare())}>
      <SheetContent side="bottom" className="h-[92dvh] max-w-none p-0 flex flex-col rounded-t-3xl bg-background">
        <SheetHeader className="px-6 py-5 border-b border-hairline flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center size-9 rounded-full bg-foreground text-background">
              <GitCompare className="size-4" strokeWidth={1.75} />
            </div>
            <div>
              <SheetTitle className="text-base font-semibold">Side-by-side compare</SheetTitle>
              <p className="text-xs text-ink-soft mt-0.5">
                {items.length} device{items.length === 1 ? "" : "s"} · differences highlighted
              </p>
            </div>
          </div>
          <button
            onClick={() => compare.clear()}
            className="text-xs text-ink-soft hover:text-foreground hairline rounded-full px-3 py-1.5"
          >
            Clear all
          </button>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="grid place-items-center h-full text-center px-6">
              <div>
                <div className="mx-auto grid place-items-center size-14 rounded-full bg-surface">
                  <GitCompare className="size-5" strokeWidth={1.5} />
                </div>
                <p className="mt-4 text-sm text-ink-soft">Add up to 4 products to compare.</p>
              </div>
            </div>
          ) : (
            <div className="container-dz py-8">
              <div
                className="grid gap-4 items-stretch"
                style={{ gridTemplateColumns: `180px repeat(${items.length}, minmax(220px, 1fr))` }}
              >
                {/* Header row */}
                <div className="hidden lg:block" />
                {items.map((p) => {
                  const off = Math.round(((p.original - p.price) / p.original) * 100);
                  return (
                    <div key={p.id} className="relative hairline rounded-2xl p-4 bg-surface/40 group">
                      <button
                        onClick={() => compare.remove(p.id)}
                        aria-label="Remove"
                        className="absolute top-2 right-2 grid place-items-center size-7 rounded-full bg-background hairline opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="size-3.5" />
                      </button>
                      <div className="aspect-square rounded-xl bg-background overflow-hidden">
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
                      </div>
                      <div className="mt-4 eyebrow text-[10px]">{p.brand}</div>
                      <div className="mt-1 text-sm font-medium line-clamp-2 min-h-[2.5rem]">{p.name}</div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-lg font-semibold">{inr(p.price)}</span>
                        {off > 0 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-foreground text-background">−{off}%</span>
                        )}
                      </div>
                      <div className="text-[11px] text-ink-soft line-through">{inr(p.original)}</div>
                      <div className="mt-4 flex flex-col gap-1.5">
                        <button
                          onClick={() => cart.add(p.id)}
                          className="w-full rounded-full hairline hover:border-foreground text-xs py-2 inline-flex items-center justify-center gap-1.5 transition"
                        >
                          <ShoppingBag className="size-3" /> Add to bag
                        </button>
                        <a
                          href={productInquiryUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => drawers.closeCompare()}
                          className="w-full rounded-full bg-foreground text-background text-xs py-2 inline-flex items-center justify-center gap-1.5"
                        >
                          <MessageCircle className="size-3" /> Order
                        </a>
                      </div>
                    </div>
                  );
                })}

                {/* Grouped attribute rows */}
                {groups.map((g) => (
                  <Fragment key={g.section}>
                    <div className="col-span-full mt-8 pb-2">
                      <div className="eyebrow text-[10px]">{g.section}</div>
                    </div>
                    {g.rows.map((row, ri) => (
                      <Fragment key={row.label}>
                        <div
                          className={`py-3.5 text-xs text-ink-soft self-center ${
                            ri === 0 ? "" : "border-t border-hairline"
                          }`}
                        >
                          {row.label}
                        </div>
                        {items.map((p) => {
                          const val = (p as any)[row.key];
                          const differs = isBest(row.key as string, val);
                          return (
                            <div
                              key={`${p.id}-${row.label}`}
                              className={`py-3.5 text-sm ${ri === 0 ? "" : "border-t border-hairline"}`}
                            >
                              <span
                                className={
                                  differs
                                    ? "font-medium"
                                    : "text-ink-soft"
                                }
                              >
                                {String(val ?? "—")}
                              </span>
                              {differs ? (
                                <span className="ml-2 inline-block align-middle size-1.5 rounded-full bg-[color:var(--accent-blue)]" />
                              ) : null}
                            </div>
                          );
                        })}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}

                {/* Warranty / QC common features row */}
                <div className="col-span-full mt-8 pb-2">
                  <div className="eyebrow text-[10px]">Included with every device</div>
                </div>
                {["1-year warranty", "100-pt inspection", "Fresh Windows install"].map((feat, fi) => (
                  <Fragment key={feat}>
                    <div className={`py-3 text-xs text-ink-soft self-center ${fi === 0 ? "" : "border-t border-hairline"}`}>
                      {feat}
                    </div>
                    {items.map((p) => (
                      <div key={`${p.id}-${feat}`} className={`py-3 text-sm ${fi === 0 ? "" : "border-t border-hairline"}`}>
                        <Check className="size-4 text-[color:var(--success)]" />
                      </div>
                    ))}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}