// Thin facade over the Supabase-backed admin store. Products are live data;
// consumers should prefer `useProducts()` / `useProduct(id)` inside components.
import { getAdminState, useAdmin, type Product } from "./admin-store";

export type { Product };

export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

/** Synchronous lookup against the current hydrated snapshot. */
export function getProduct(id: string): Product | undefined {
  return getAdminState().products.find((p) => p.id === id);
}

/** Reactive hook returning all products. */
export function useProducts(): Product[] {
  return useAdmin((s) => s.products);
}

/** Reactive hook returning a single product by id. */
export function useProduct(id: string | undefined): Product | undefined {
  return useAdmin((s) => (id ? s.products.find((p) => p.id === id) : undefined));
}