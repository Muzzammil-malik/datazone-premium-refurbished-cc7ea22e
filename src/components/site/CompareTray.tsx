import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { compare, drawers, useStore, useUI } from "@/lib/store";
import { getProduct, inr } from "@/lib/products";
import { GitCompare, X, MessageCircle, Sparkles } from "lucide-react";
import { productInquiryUrl } from "@/lib/whatsapp";
import { AnimatePresence, motion } from "framer-motion";
import { Fragment, useState } from "react";
import { AIBot } from "@/components/site/AIBot";

export function CompareBar() {
  const ids = useStore((s) => s.compare);
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
  const items = ids.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  const [showAI, setShowAI] = useState(false);
  const aiContext = `Comparing the following products:\n${items.map(i => `- ${i.name}: ₹${i.price}, ${i.processor}, ${i.ram}, ${i.gpu}`).join("\n")}`;

  const rows: { label: string; key: keyof (typeof items)[number] }[] = [
    { label: "Brand", key: "brand" },
    { label: "Category", key: "category" },
    { label: "Processor", key: "processor" },
    { label: "Memory", key: "ram" },
    { label: "Storage", key: "storage" },
    { label: "Graphics", key: "gpu" },
    { label: "Condition", key: "condition" },
    { label: "Availability", key: "availability" },
  ];

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? drawers.openCompare() : drawers.closeCompare())}>
      <SheetContent side="bottom" className="h-[90dvh] max-w-none p-0 flex flex-col rounded-t-3xl">
        <SheetHeader className="p-6 border-b border-hairline">
          <SheetTitle className="flex items-center gap-2 text-base">
            <GitCompare className="size-4" strokeWidth={1.5} /> Quick compare
          </SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-auto">
          <div className="container-dz py-8">
            <div
              className="grid gap-4"
              style={{ gridTemplateColumns: `160px repeat(${items.length}, minmax(200px, 1fr))` }}
            >
              <div />
              {items.map((p) => (
                <div key={p.id} className="hairline rounded-2xl p-4 bg-background">
                  <div className="aspect-square rounded-xl bg-surface overflow-hidden">
                    <img src={p.image} alt={p.name} className="h-full w-full object-contain p-4" />
                  </div>
                  <div className="mt-3 text-sm font-medium line-clamp-2">{p.name}</div>
                  <div className="mt-1 text-base font-semibold">{inr(p.price)}</div>
                  <div className="mt-3 flex gap-2">
                    <a
                      href={productInquiryUrl(p)}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => drawers.closeCompare()}
                      className="flex-1 rounded-full bg-foreground text-background text-xs py-2 inline-flex items-center justify-center gap-1"
                    >
                      <MessageCircle className="size-3" /> Order
                    </a>
                    <button
                      onClick={() => compare.remove(p.id)}
                      className="rounded-full hairline text-xs px-3 py-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {rows.map((row) => (
                <Fragment key={row.label}>
                  <div className="py-3 text-xs text-ink-soft uppercase tracking-wider self-center">
                    {row.label}
                  </div>
                  {items.map((p) => (
                    <div
                      key={`${p.id}-${row.label}`}
                      className="py-3 text-sm border-t border-hairline"
                    >
                      {String(p[row.key] ?? "—")}
                    </div>
                  ))}
                </Fragment>
              ))}

              <div className="py-3 text-xs text-ink-soft uppercase tracking-wider self-center">
                Price
              </div>
              {items.map((p) => (
                <div key={`${p.id}-price`} className="py-3 text-sm border-t border-hairline font-semibold">
                  {inr(p.price)}
                </div>
              ))}
            </div>
          </div>
          {items.length > 0 && (
            <div className="container-dz pb-8 flex flex-col items-center">
              {!showAI ? (
                <button
                  onClick={() => setShowAI(true)}
                  className="bg-foreground text-background px-6 py-3 rounded-full text-sm font-medium flex items-center gap-2 hover:scale-105 transition-transform"
                >
                  <Sparkles className="size-4" /> Ask AI to Compare
                </button>
              ) : (
                <div className="w-full max-w-2xl mt-4">
                  <AIBot 
                    context={aiContext}
                    initialPrompt="Can you help me choose between these products?"
                    onClose={() => setShowAI(false)}
                    className="h-[400px]"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}