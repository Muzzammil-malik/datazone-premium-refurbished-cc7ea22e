import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { inr } from "@/lib/products";
import { CheckCircle2, Package, Truck, ArrowRight, Mail } from "lucide-react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/order/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Order ${params.id} — DATAZONe` },
      { name: "description", content: "Your DATAZONe order confirmation." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderPage,
});

type StoredOrder = {
  id: string;
  createdAt: string;
  items: { id: string; name: string; brand: string; price: number; image: string; qty: number }[];
  totals: { subtotal: number; shipping: number; tax: number; total: number; count: number };
  customer: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    payment: string;
  };
};

function OrderPage() {
  const { id } = Route.useParams();
  const [order, setOrder] = useState<StoredOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("datazone.orders");
      const list = raw ? JSON.parse(raw) : {};
      setOrder(list[id] ?? null);
    } catch {}
    setLoaded(true);
  }, [id]);

  if (!loaded) return <div className="container-dz py-24" />;

  if (!order) {
    return (
      <div className="container-dz py-24 text-center">
        <div className="eyebrow">Not found</div>
        <h1 className="display-lg mt-3">Order not found</h1>
        <p className="mt-3 text-ink-soft">We couldn't locate order {id} on this device.</p>
        <Link to="/shop" className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm">
          Back to shop <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const eta = new Date(Date.now() + 4 * 86400_000).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <div className="container-dz py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto grid place-items-center size-20 rounded-full bg-foreground text-background"
        >
          <CheckCircle2 className="size-10" strokeWidth={1.5} />
        </motion.div>
        <div className="eyebrow mt-8">Confirmed</div>
        <h1 className="display-lg mt-3">Thank you, {order.customer.firstName}.</h1>
        <p className="mt-4 text-ink-soft text-lg">
          Your order <span className="font-medium text-foreground">{order.id}</span> is placed.
          A confirmation has been sent to {order.customer.email}.
        </p>
      </motion.div>

      <div className="mt-14 max-w-3xl mx-auto grid gap-6 md:grid-cols-3">
        {[
          { i: CheckCircle2, t: "Confirmed", d: "Today", active: true },
          { i: Package, t: "Packed", d: "In 24h", active: false },
          { i: Truck, t: "Delivered", d: eta, active: false },
        ].map((s) => (
          <div key={s.t} className={`hairline rounded-2xl p-5 ${s.active ? "bg-foreground text-background border-foreground" : "bg-background"}`}>
            <s.i className="size-5" strokeWidth={1.5} />
            <div className="mt-4 text-sm font-semibold">{s.t}</div>
            <div className={`mt-1 text-xs ${s.active ? "text-background/70" : "text-ink-soft"}`}>{s.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-14 max-w-3xl mx-auto grid gap-6 md:grid-cols-2">
        <div className="hairline rounded-3xl p-6">
          <div className="text-sm font-semibold">Shipping to</div>
          <div className="mt-3 text-sm text-ink-soft leading-relaxed">
            {order.customer.firstName} {order.customer.lastName}<br />
            {order.customer.address}<br />
            {order.customer.city}, {order.customer.state} {order.customer.pincode}
          </div>
        </div>
        <div className="hairline rounded-3xl p-6">
          <div className="text-sm font-semibold">Payment</div>
          <div className="mt-3 text-sm text-ink-soft capitalize">
            {order.customer.payment === "cod" ? "Cash on delivery" : order.customer.payment === "upi" ? "UPI" : "Credit / Debit card"}
          </div>
          <div className="mt-6 text-sm font-semibold">Estimated delivery</div>
          <div className="mt-3 text-sm text-ink-soft">{eta}</div>
        </div>
      </div>

      <div className="mt-14 max-w-3xl mx-auto hairline rounded-3xl overflow-hidden">
        <ul className="divide-y divide-hairline">
          {order.items.map((it) => (
            <li key={it.id} className="p-5 flex items-center gap-4">
              <div className="size-16 rounded-xl bg-surface overflow-hidden shrink-0">
                <img src={it.image} alt={it.name} className="h-full w-full object-contain p-1.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="eyebrow text-[10px]">{it.brand}</div>
                <div className="text-sm font-medium truncate">{it.name}</div>
                <div className="text-xs text-ink-soft">Qty {it.qty}</div>
              </div>
              <div className="text-sm font-medium">{inr(it.price * it.qty)}</div>
            </li>
          ))}
        </ul>
        <div className="p-5 bg-surface space-y-1.5 text-sm">
          <Row label="Subtotal" value={inr(order.totals.subtotal)} />
          <Row label="Shipping" value={order.totals.shipping === 0 ? "Free" : inr(order.totals.shipping)} />
          <Row label="GST (18%)" value={inr(order.totals.tax)} />
          <div className="pt-3 mt-3 border-t border-hairline flex items-center justify-between">
            <span className="font-semibold">Total paid</span>
            <span className="text-lg font-bold">{inr(order.totals.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-12 max-w-3xl mx-auto flex flex-wrap items-center justify-center gap-3">
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm">
          Continue shopping <ArrowRight className="size-4" />
        </Link>
        <a href={`mailto:support@datazone.com?subject=Order ${order.id}`} className="inline-flex items-center gap-2 rounded-full hairline px-6 py-3 text-sm hover:border-foreground transition">
          <Mail className="size-4" /> Need help?
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-soft">{label}</span>
      <span>{value}</span>
    </div>
  );
}