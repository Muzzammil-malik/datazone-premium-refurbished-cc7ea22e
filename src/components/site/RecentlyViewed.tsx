import { useStore } from "@/lib/store";
import { getProduct } from "@/lib/products";
import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ excludeId, title = "Recently viewed" }: { excludeId?: string; title?: string }) {
  const ids = useStore((s) => s.recent);
  const items = ids
    .filter((id) => id !== excludeId)
    .map(getProduct)
    .filter(Boolean)
    .slice(0, 4) as NonNullable<ReturnType<typeof getProduct>>[];
  if (items.length === 0) return null;
  return (
    <section className="container-dz mt-28">
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="eyebrow">Continue browsing</div>
          <h2 className="display-lg mt-3">{title}</h2>
        </div>
      </div>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p, i) => (
          <ProductCard key={p.id} product={p} index={i} />
        ))}
      </div>
    </section>
  );
}