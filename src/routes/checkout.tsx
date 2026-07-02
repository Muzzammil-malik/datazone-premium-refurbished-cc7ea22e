import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { cart, cartTotals, useStore } from "@/lib/store";
import { getProduct, inr } from "@/lib/products";
import { ArrowRight, Lock, ShoppingBag } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — DATAZONe" },
      { name: "description", content: "Secure checkout for your DATAZONe order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

type Form = {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment: "card" | "upi" | "cod";
};

function Checkout() {
  const items = useStore((s) => s.cart);
  const totals = cartTotals(items, getProduct);
  const navigate = useNavigate();
  const [form, setForm] = useState<Form>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "card",
  });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container-dz py-24 text-center">
        <div className="mx-auto grid place-items-center size-16 rounded-full bg-surface">
          <ShoppingBag className="size-6" strokeWidth={1.5} />
        </div>
        <h1 className="display-lg mt-6">Your bag is empty.</h1>
        <p className="mt-3 text-ink-soft">Add something you love, then check out.</p>
        <Link
          to="/shop"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm"
        >
          Browse shop <ArrowRight className="size-4" />
        </Link>
      </div>
    );
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const orderId = `DZ-${Date.now().toString(36).toUpperCase()}`;
    const order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      items: items.map((it) => {
        const p = getProduct(it.id)!;
        return { id: p.id, name: p.name, brand: p.brand, price: p.price, image: p.image, qty: it.qty };
      }),
      totals,
      customer: form,
    };
    try {
      const key = `datazone.orders`;
      const raw = localStorage.getItem(key);
      const list = raw ? JSON.parse(raw) : {};
      list[orderId] = order;
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
    setTimeout(() => {
      cart.clear();
      navigate({ to: "/order/$id", params: { id: orderId } });
    }, 700);
  };

  const upd = <K extends keyof Form>(k: K) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="container-dz py-12 md:py-16">
      <div className="max-w-2xl">
        <div className="eyebrow">Checkout</div>
        <h1 className="display-lg mt-3">Almost yours.</h1>
      </div>

      <form onSubmit={onSubmit} className="mt-12 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-10">
          <Section title="Contact">
            <Field label="Email" value={form.email} onChange={upd("email")} type="email" required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="First name" value={form.firstName} onChange={upd("firstName")} required />
              <Field label="Last name" value={form.lastName} onChange={upd("lastName")} required />
            </div>
            <Field label="Phone" value={form.phone} onChange={upd("phone")} type="tel" required />
          </Section>

          <Section title="Shipping address">
            <Field label="Street address" value={form.address} onChange={upd("address")} required />
            <div className="grid grid-cols-2 gap-3">
              <Field label="City" value={form.city} onChange={upd("city")} required />
              <Field label="State" value={form.state} onChange={upd("state")} required />
            </div>
            <Field label="PIN code" value={form.pincode} onChange={upd("pincode")} required />
          </Section>

          <Section title="Payment method">
            <div className="grid gap-2">
              {(["card", "upi", "cod"] as const).map((m) => (
                <label
                  key={m}
                  className={`flex items-center gap-3 hairline rounded-2xl p-4 cursor-pointer transition ${
                    form.payment === m ? "border-foreground bg-surface" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={m}
                    checked={form.payment === m}
                    onChange={() => setForm((f) => ({ ...f, payment: m }))}
                    className="accent-foreground"
                  />
                  <span className="text-sm font-medium capitalize">
                    {m === "card" ? "Credit / Debit card" : m === "upi" ? "UPI" : "Cash on delivery"}
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-ink-soft">
              <Lock className="size-3" /> Encrypted checkout · demo mode
            </p>
          </Section>
        </div>

        <aside className="lg:sticky lg:top-24 self-start">
          <div className="hairline rounded-3xl p-6 bg-surface">
            <div className="text-sm font-semibold">Order summary</div>
            <ul className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-2">
              {items.map((it) => {
                const p = getProduct(it.id);
                if (!p) return null;
                return (
                  <li key={it.id} className="flex gap-3 items-center">
                    <div className="relative size-14 rounded-xl bg-background hairline overflow-hidden shrink-0">
                      <img src={p.image} alt="" className="h-full w-full object-contain p-1.5" />
                      <span className="absolute -top-1 -right-1 size-5 rounded-full bg-foreground text-background text-[10px] grid place-items-center">
                        {it.qty}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs truncate font-medium">{p.name}</div>
                      <div className="text-[11px] text-ink-soft">{p.brand}</div>
                    </div>
                    <div className="text-xs font-medium">{inr(p.price * it.qty)}</div>
                  </li>
                );
              })}
            </ul>
            <div className="mt-5 pt-5 border-t border-hairline space-y-1.5 text-sm">
              <Row label="Subtotal" value={inr(totals.subtotal)} />
              <Row label="Shipping" value={totals.shipping === 0 ? "Free" : inr(totals.shipping)} />
              <Row label="GST (18%)" value={inr(totals.tax)} />
            </div>
            <div className="mt-4 pt-4 border-t border-hairline flex items-center justify-between">
              <span className="text-sm">Total</span>
              <span className="text-lg font-semibold">{inr(totals.total)}</span>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-full bg-foreground text-background py-3.5 text-sm font-medium hover:opacity-90 transition inline-flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? "Placing order…" : (
                <>
                  Place order · {inr(totals.total)} <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-sm font-semibold mb-4">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-ink-soft">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full hairline rounded-xl px-4 py-3 text-sm bg-background focus:outline-none focus:border-foreground transition"
      />
    </label>
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