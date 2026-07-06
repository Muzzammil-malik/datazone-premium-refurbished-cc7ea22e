import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cart, drawers, useStore, useUI } from "@/lib/store";
import { getProduct, inr, useProducts } from "@/lib/products";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { cartInquiryUrl } from "@/lib/whatsapp";

export function CartDrawer() {
  const open = useUI((u) => u.cartOpen);
  const items = useStore((s) => s.cart);
  useProducts(); // subscribe so drawer updates when products hydrate/change
  const count = items.reduce((n, i) => n + i.qty, 0);
  const subtotal = items.reduce((n, i) => {
    const p = getProduct(i.id);
    return n + (p ? p.price * i.qty : 0);
  }, 0);

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? drawers.openCart() : drawers.closeCart())}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-hairline">
          <SheetTitle className="flex items-center gap-2 text-base">
            <ShoppingBag className="size-4" strokeWidth={1.5} /> Your bag ({count})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto grid place-items-center size-14 rounded-full bg-surface">
                <ShoppingBag className="size-5" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm text-ink-soft">Your bag is empty.</p>
              <Link
                to="/shop"
                onClick={() => drawers.closeCart()}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm"
              >
                Start shopping <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {items.map((it) => {
                const p = getProduct(it.id);
                if (!p) return null;
                return (
                  <li key={it.id} className="p-5 flex gap-4">
                    <div className="size-20 rounded-xl bg-surface hairline overflow-hidden shrink-0">
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain p-2" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="eyebrow text-[10px]">{p.brand}</div>
                      <div className="text-sm font-medium truncate">{p.name}</div>
                      <div className="mt-1 text-xs text-ink-soft">{inr(p.price)}</div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center hairline rounded-full">
                          <button
                            aria-label="Decrease"
                            className="p-2 hover:bg-surface rounded-full"
                            onClick={() => cart.setQty(it.id, it.qty - 1)}
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-8 text-center text-xs">{it.qty}</span>
                          <button
                            aria-label="Increase"
                            className="p-2 hover:bg-surface rounded-full"
                            onClick={() => cart.setQty(it.id, it.qty + 1)}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button
                          aria-label="Remove"
                          className="text-ink-soft hover:text-foreground"
                          onClick={() => cart.remove(it.id)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-hairline p-6 space-y-4 bg-background">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-soft">Estimated subtotal</span>
              <span className="text-lg font-semibold">{inr(subtotal)}</span>
            </div>
            <a
              href={cartInquiryUrl(items, getProduct)}
              target="_blank"
              rel="noreferrer"
              onClick={() => drawers.closeCart()}
              className="w-full rounded-full bg-foreground text-background py-3.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} /> Order on WhatsApp
            </a>
            <p className="text-[11px] text-ink-soft text-center">
              We consult every order personally on WhatsApp — no online payments or delivery.
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
