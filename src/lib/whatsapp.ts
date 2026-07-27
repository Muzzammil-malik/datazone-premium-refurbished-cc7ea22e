import { inr, type Product } from "@/lib/products";
import { getAdminState } from "@/lib/admin-store";

export const WHATSAPP_NUMBER = "919999999999";

export function whatsappUrl(message: string) {
  const settings = getAdminState().settings;
  const number = (settings?.whatsapp || WHATSAPP_NUMBER).replace(/\D+/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productInquiryUrl(p: Product, qty = 1, selectedVariantIds?: string[]) {
  const selectedVariants = selectedVariantIds
    ? p.variants?.filter((v) => selectedVariantIds.includes(v.id)) || []
    : [];
  const price = selectedVariants.length > 0
    ? selectedVariants.reduce((sum, v) => sum + v.price, 0)
    : p.price;
  const variantInfo = selectedVariants.length > 0
    ? selectedVariants.map((v) => `  Variant: ${v.type} - ${v.value}${v.sku ? ` (SKU: ${v.sku})` : ""}`)
    : [];

  const lines = [
    `Hi DATAZONe, I'd like to order this device:`,
    ``,
    `• ${p.name}`,
    `  Brand: ${p.brand}`,
    `  Condition: ${p.condition}`,
    ...variantInfo,
    `  Price: ${inr(price)}`,
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