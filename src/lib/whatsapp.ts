import { inr, type Product } from "@/lib/products";
import { getAdminState } from "@/lib/admin-store";

export const WHATSAPP_NUMBER = "919999999999";

export function whatsappUrl(message: string) {
  const settings = getAdminState().settings;
  const number = (settings?.whatsapp || WHATSAPP_NUMBER).replace(/\D+/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function productInquiryUrl(p: Product, qty = 1, selectedVariants?: Record<string, string>) {
  // Calculate price based on base price + variant adjustments
  const basePrice = p.basePrice || p.price || 0;
  let price = basePrice;
  const variantInfo: string[] = [];
  
  if (selectedVariants && p.variantGroups) {
    const selectedOptionIds = Object.values(selectedVariants);
    const selectedOptions = p.variantGroups.flatMap((g) => g.options || []).filter((o) => selectedOptionIds.includes(o.id));
    const adjustmentSum = selectedOptions.reduce((sum, o) => sum + (o.priceAdjustment || 0), 0);
    price = basePrice + adjustmentSum;
    
    // Build variant info string
    p.variantGroups.forEach((group) => {
      const selectedOptionId = selectedVariants[group.id];
      const option = group.options?.find((o) => o.id === selectedOptionId);
      if (option) {
        variantInfo.push(`  ${group.name}: ${option.value}`);
      }
    });
  }

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