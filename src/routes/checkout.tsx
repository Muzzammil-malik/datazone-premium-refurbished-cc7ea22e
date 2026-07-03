import { createFileRoute, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { getProduct, inr } from "@/lib/products";
import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { cartInquiryUrl } from "@/lib/whatsapp";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Order on WhatsApp — DATAZONe" },
      {
        name: "description",
        content:
          "DATAZONe orders are confirmed personally on WhatsApp — no online payments, no delivery. Chat with us to finalise your device.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WhatsAppHandoff,
});

function WhatsAppHandoff() {
  const items = useStore((s) => s.cart);
  const subtotal = items.reduce((n, it) => {
    const p = getProduct(it.id);
    return n + (p ? p.price * it.qty : 0);
  }, 0);

  if (items.length === 0) {
    return (
      <div className="container-dz py-24 text-center">
        <div className="mx-auto grid place-items-center size-16 rounded-full bg-surface">
          <ShoppingBag className="size-6" strokeWidth={1.5} />
        </div>
        <h1 className="display-lg mt-6">Your bag is empty.</h1>
        <p className="mt-3 text-ink-soft">
          Add something you love, then continue on WhatsApp.
        </p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm"
        >
          Browse shop <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-dz py-12 md:py-16">
      <div className="max-w-2xl">
        <div className="eyebrow">Order</div>
        <h1 className="display-lg mt-3">One tap. Real humans.</h1>
        <p className="mt-4 text-ink-soft max-w-lg">
          DATAZONe doesn't do online payments or delivery — every order is
          consulted personally on WhatsApp so we can match you with the exact
          right device.
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="hairline rounded-3xl p-6 bg-surface">
          <div className="text-sm font-semibold">Your selection</div>
          <ul className="mt-4 divide-y divide-hairline">
            {items.map((it) => {
              const p = getProduct(it.id);
              if (!p) return null;
              return (
                <li key={it.id} className="py-4 flex gap-4 items-center">
                  <div className="relative size-16 rounded-xl bg-background hairline overflow-hidden shrink-0">
                    <img
                      src={p.image}
                      alt=""
                      className="h-full w-full object-contain p-1.5"
                    />
                    <span className="absolute -top-1 -right-1 size-5 rounded-full bg-foreground text-background text-[10px] grid place-items-center">
                      {it.qty}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm truncate font-medium">{p.name}</div>
                    <div className="text-[11px] text-ink-soft">{p.brand}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {inr(p.price * it.qty)}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 pt-6 border-t border-hairline flex items-center justify-between">
            <span className="text-sm text-ink-soft">Estimated subtotal</span>
            <span className="text-lg font-semibold">{inr(subtotal)}</span>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="hairline rounded-3xl p-6">
            <div className="text-sm font-semibold">Continue on WhatsApp</div>
            <p className="mt-2 text-xs text-ink-soft">
              We'll open a chat with your selection pre-filled. Confirm the
              device, availability, and store pickup — no payment collected
              online.
            </p>
            <a
              href={cartInquiryUrl(items, getProduct)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 w-full rounded-full bg-foreground text-background py-3.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="size-4" strokeWidth={1.75} /> Order on WhatsApp
            </a>
            <Link
              to="/shop"
              className="mt-3 w-full rounded-full hairline py-3 text-sm inline-flex items-center justify-center gap-2 hover:bg-surface transition"
            >
              Keep browsing
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}