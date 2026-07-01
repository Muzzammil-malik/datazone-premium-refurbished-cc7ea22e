import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { inr, type Product } from "@/lib/products";
import { Heart } from "lucide-react";

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const off = Math.round(((product.original - product.price) / product.original) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-surface hairline">
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="text-[10px] px-2 py-1 rounded-full bg-background hairline tracking-wider uppercase">{product.condition}</span>
            {off > 0 && <span className="text-[10px] px-2 py-1 rounded-full bg-foreground text-background tracking-wider">−{off}%</span>}
          </div>
          <button
            type="button"
            aria-label="Add to wishlist"
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 z-10 grid place-items-center size-9 rounded-full bg-background/80 backdrop-blur hairline opacity-0 group-hover:opacity-100 transition"
          >
            <Heart className="size-4" strokeWidth={1.5} />
          </button>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-contain p-6 transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="eyebrow text-[10px]">{product.brand}</div>
            <h3 className="mt-1 text-[15px] font-medium truncate">{product.name}</h3>
            <p className="mt-0.5 text-xs text-ink-soft truncate">{product.processor} · {product.ram}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[15px] font-semibold">{inr(product.price)}</div>
            <div className="text-[11px] text-ink-soft line-through">{inr(product.original)}</div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}