import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Linkedin, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-hairline bg-surface">
      <div className="container-dz py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <div className="text-xl font-bold tracking-tight">
              DATAZON<span className="text-[color:var(--accent-blue)]">e</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-soft leading-relaxed">
              Premium refurbished computers, monitors and services — inspected,
              warrantied and delivered with care.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <a key={i} href="#" aria-label="social" className="p-2.5 rounded-full hairline hover:border-foreground transition">
                  <Icon className="size-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>
          <FooterCol title="Shop" items={[
            { label: "Laptops", to: "/shop" },
            { label: "Desktops", to: "/shop" },
            { label: "Monitors", to: "/shop" },
            { label: "Accessories", to: "/shop" },
          ]} />
          <FooterCol title="Company" items={[
            { label: "About", to: "/about" },
            { label: "Services", to: "/services" },
            { label: "Warranty", to: "/warranty" },
            { label: "Contact", to: "/contact" },
          ]} />
          <FooterCol title="Support" items={[
            { label: "Help Center", to: "/contact" },
            { label: "Track Order", to: "/contact" },
            { label: "Returns", to: "/warranty" },
            { label: "FAQ", to: "/warranty" },
          ]} />
          <div>
            <div className="eyebrow">Visit us</div>
            <div className="mt-4 aspect-[4/3] rounded-2xl overflow-hidden hairline relative bg-background">
              <iframe
                title="DATAZONe location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.19%2C28.60%2C77.25%2C28.64&layer=mapnik"
                className="absolute inset-0 h-full w-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <MapPin className="size-3.5" /> New Delhi · India
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <div>© {new Date().getFullYear()} DATAZONe. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms</a>
            <a href="#" className="hover:text-foreground">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <div className="eyebrow">{title}</div>
      <ul className="mt-4 space-y-3">
        {items.map((i) => (
          <li key={i.label}>
            <Link to={i.to} className="text-sm text-ink-soft hover:text-foreground transition">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}