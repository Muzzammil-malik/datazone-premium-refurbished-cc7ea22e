import { useSyncExternalStore } from "react";
import type { Product } from "./products";

type CartItem = { id: string; qty: number };
type State = {
  cart: CartItem[];
  wishlist: string[];
  compare: string[];
  recent: string[];
};

const KEY = "datazone.store.v1";
const initial: State = { cart: [], wishlist: [], compare: [], recent: [] };

let state: State = initial;
const listeners = new Set<() => void>();

function load() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) state = { ...initial, ...JSON.parse(raw) };
  } catch {}
}
load();

function persist() {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  persist();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(initial),
  );
}

// Cart
export const cart = {
  add(id: string, qty = 1) {
    const existing = state.cart.find((c) => c.id === id);
    const next = existing
      ? state.cart.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c))
      : [...state.cart, { id, qty }];
    set({ cart: next });
  },
  remove(id: string) {
    set({ cart: state.cart.filter((c) => c.id !== id) });
  },
  setQty(id: string, qty: number) {
    if (qty <= 0) return cart.remove(id);
    set({ cart: state.cart.map((c) => (c.id === id ? { ...c, qty } : c)) });
  },
  clear() {
    set({ cart: [] });
  },
};

// Wishlist
export const wishlist = {
  toggle(id: string) {
    const has = state.wishlist.includes(id);
    set({ wishlist: has ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id] });
  },
  remove(id: string) {
    set({ wishlist: state.wishlist.filter((x) => x !== id) });
  },
  has(id: string) {
    return state.wishlist.includes(id);
  },
};

// Compare (max 4)
export const compare = {
  toggle(id: string) {
    const has = state.compare.includes(id);
    if (has) return set({ compare: state.compare.filter((x) => x !== id) });
    if (state.compare.length >= 4) return;
    set({ compare: [...state.compare, id] });
  },
  remove(id: string) {
    set({ compare: state.compare.filter((x) => x !== id) });
  },
  clear() {
    set({ compare: [] });
  },
  has(id: string) {
    return state.compare.includes(id);
  },
};

// Recently viewed (max 8)
export const recent = {
  push(id: string) {
    const filtered = state.recent.filter((x) => x !== id);
    set({ recent: [id, ...filtered].slice(0, 8) });
  },
};

// UI drawer state (not persisted)
type UI = { cartOpen: boolean; wishlistOpen: boolean; compareOpen: boolean };
let ui: UI = { cartOpen: false, wishlistOpen: false, compareOpen: false };
const uiListeners = new Set<() => void>();
function setUI(next: Partial<UI>) {
  ui = { ...ui, ...next };
  uiListeners.forEach((l) => l());
}
export function useUI<T>(sel: (u: UI) => T): T {
  return useSyncExternalStore(
    (cb) => {
      uiListeners.add(cb);
      return () => uiListeners.delete(cb);
    },
    () => sel(ui),
    () => sel({ cartOpen: false, wishlistOpen: false, compareOpen: false }),
  );
}
export const drawers = {
  openCart: () => setUI({ cartOpen: true }),
  closeCart: () => setUI({ cartOpen: false }),
  openWishlist: () => setUI({ wishlistOpen: true }),
  closeWishlist: () => setUI({ wishlistOpen: false }),
  openCompare: () => setUI({ compareOpen: true }),
  closeCompare: () => setUI({ compareOpen: false }),
};

// Helpers
export function cartTotals(items: CartItem[], byId: (id: string) => Product | undefined) {
  let subtotal = 0;
  let count = 0;
  for (const it of items) {
    const p = byId(it.id);
    if (!p) continue;
    subtotal += p.price * it.qty;
    count += it.qty;
  }
  const shipping = subtotal > 0 && subtotal < 50000 ? 499 : 0;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total, count };
}

export type { CartItem };