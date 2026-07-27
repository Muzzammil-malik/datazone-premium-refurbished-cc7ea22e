import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, ShoppingBag, Heart, Menu, X, GitCompare } from "lucide-react";
import { drawers, useStore } from "@/lib/store";
import { useAdmin } from "@/lib/admin-store";

const links = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/services", label: "Services" },
  { to: "/warranty", label: "Warranty" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const cartCount = useStore((s) => s.cart.reduce((n, c) => n + c.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const compareCount = useStore((s) => s.compare.length);
  const settings = useAdmin((s) => s.settings);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/75 border-b border-hairline"
          : "bg-transparent"
      }`}
    >
      <div className="container-dz flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-[1.15rem] font-bold tracking-tight">
            {settings.storeName}
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-ink-soft hover:text-foreground transition-colors relative"
              activeProps={{ className: "text-foreground" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <button aria-label="Search" className="p-2 hover:bg-surface rounded-full transition">
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          {compareCount > 0 && (
            <button
              aria-label="Compare"
              onClick={() => drawers.openCompare()}
              className="hidden sm:grid place-items-center p-2 hover:bg-surface rounded-full transition relative"
            >
              <GitCompare className="size-[18px]" strokeWidth={1.5} />
              <Badge n={compareCount} />
            </button>
          )}
          <button
            aria-label="Wishlist"
            onClick={() => drawers.openWishlist()}
            className="hidden sm:grid place-items-center p-2 hover:bg-surface rounded-full transition relative"
          >
            <Heart className="size-[18px]" strokeWidth={1.5} />
            {wishCount > 0 && <Badge n={wishCount} />}
          </button>
          <button
            aria-label="Cart"
            onClick={() => drawers.openCart()}
            className="p-2 hover:bg-surface rounded-full transition relative"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            {cartCount > 0 ? (
              <Badge n={cartCount} />
            ) : (
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-[color:var(--accent-blue)]" />
            )}
          </button>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            className="md:hidden p-2 hover:bg-surface rounded-full transition"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-hairline bg-background">
          <div className="container-dz py-4 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-3 text-base"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

function Badge({ n }: { n: number }) {
  return (
    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] px-1 grid place-items-center rounded-full bg-foreground text-background text-[10px] font-medium leading-none">
      {n > 9 ? "9+" : n}
    </span>
  );
}