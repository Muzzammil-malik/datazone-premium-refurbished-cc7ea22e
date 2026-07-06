import { Link } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { drawers, useStore, useUI, wishlist } from "@/lib/store";
import { getProduct, inr, useProducts } from "@/lib/products";
import { Heart, Trash2, MessageCircle } from "lucide-react";
import { productInquiryUrl } from "@/lib/whatsapp";

export function WishlistDrawer() {
  const open = useUI((u) => u.wishlistOpen);
  const ids = useStore((s) => s.wishlist);
  useProducts();

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? drawers.openWishlist() : drawers.closeWishlist())}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        <SheetHeader className="p-6 border-b border-hairline">
          <SheetTitle className="flex items-center gap-2 text-base">
            <Heart className="size-4" strokeWidth={1.5} /> Wishlist ({ids.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto">
          {ids.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto grid place-items-center size-14 rounded-full bg-surface">
                <Heart className="size-5" strokeWidth={1.5} />
              </div>
              <p className="mt-4 text-sm text-ink-soft">Nothing saved yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-hairline">
              {ids.map((id) => {
                const p = getProduct(id);
                if (!p) return null;
                return (
                  <li key={id} className="p-5 flex gap-4">
                    <Link
                      to="/product/$id"
                      params={{ id }}
                      onClick={() => drawers.closeWishlist()}
                      className="size-20 rounded-xl bg-surface hairline overflow-hidden shrink-0"
                    >
                      <img src={p.image} alt={p.name} className="h-full w-full object-contain p-2" />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="eyebrow text-[10px]">{p.brand}</div>
                      <Link
                        to="/product/$id"
                        params={{ id }}
                        onClick={() => drawers.closeWishlist()}
                        className="text-sm font-medium truncate block hover:underline"
                      >
                        {p.name}
                      </Link>
                      <div className="mt-1 text-xs text-ink-soft">{inr(p.price)}</div>
                      <div className="mt-3 flex items-center gap-2">
                        <a
                          href={productInquiryUrl(p)}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => drawers.closeWishlist()}
                          className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-background px-3 py-1.5 text-xs"
                        >
                          <MessageCircle className="size-3" /> Order on WhatsApp
                        </a>
                        <button
                          aria-label="Remove"
                          className="text-ink-soft hover:text-foreground p-1.5"
                          onClick={() => wishlist.remove(id)}
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
      </SheetContent>
    </Sheet>
  );
}