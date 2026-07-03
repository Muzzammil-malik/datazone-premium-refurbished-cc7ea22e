import { inr, type Product } from "@/lib/products";

export const WHATSAPP_NUMBER = "919999999999";

export function whatsappUrl(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function productInquiryUrl(p: Product, qty = 1) {
  const lines = [
    `Hi DATAZONe, I'd like to order this device:`,
    ``,
    `• ${p.name}`,
    `  Brand: ${p.brand}`,
    `  Condition: ${p.condition}`,
    `  Price: ${inr(p.price)}`,
    qty > 1 ? `  Qty: ${qty}` : ``,
    ``,
    `Please share availability and next steps.`,
  ].filter(Boolean);
  return whatsappUrl(lines.join("\n"));
}

export function cartInquiryUrl(
  items: { id: string; qty: number }[],
  getProduct: (id: string) => Product | undefined,
) {
  const rows: string[] = [];
  let subtotal = 0;
  items.forEach((it, i) => {
    const p = getProduct(it.id);
    if (!p) return;
    subtotal += p.price * it.qty;
    rows.push(
      `${i + 1}. ${p.name} — ${inr(p.price)} × ${it.qty} = ${inr(p.price * it.qty)}`,
    );
  });
  const message = [
    `Hi DATAZONe, I'd like to place an order for the following items:`,
    ``,
    ...rows,
    ``,
    `Estimated subtotal: ${inr(subtotal)}`,
    ``,
    `Please confirm availability and guide me on pickup / next steps.`,
  ].join("\n");
  return whatsappUrl(message);
}