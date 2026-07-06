import { Link } from "@tanstack/react-router";
import { Instagram, Facebook, Linkedin, Youtube, Globe, MapPin } from "lucide-react";
import { useAdmin } from "@/lib/admin-store";

export function Footer() {
  const settings = useAdmin((s) => s.settings);
  const storeName = settings.storeName || "DATAZONe";
  const socials = [
    settings.social?.instagram && { Icon: Instagram, url: settings.social.instagram },
    settings.social?.facebook && { Icon: Facebook, url: settings.social.facebook },
    settings.social?.linkedin && { Icon: Linkedin, url: settings.social.linkedin },
    settings.social?.youtube && { Icon: Youtube, url: settings.social.youtube },
    settings.social?.website && { Icon: Globe, url: settings.social.website },
  ].filter(Boolean) as { Icon: typeof Instagram; url: string }[];
  const mapsSrc =
    settings.mapsLink && settings.mapsLink.includes("http")
      ? settings.mapsLink
      : "https://www.openstreetmap.org/export/embed.html?bbox=77.19%2C28.60%2C77.25%2C28.64&layer=mapnik";
  return (
    <footer className="mt-32 border-t border-hairline bg-surface">
      <div className="container-dz py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <div className="text-xl font-bold tracking-tight">
              {storeName.length > 1 ? (
                <>
                  {storeName.slice(0, -1)}
                  <span className="text-[color:var(--accent-blue)]">{storeName.slice(-1)}</span>
                </>
              ) : (
                storeName
              )}
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-soft leading-relaxed">
              Premium refurbished computers, monitors and services — inspected,
              warrantied and delivered with care.
            </p>
            {socials.length > 0 && (
              <div className="mt-6 flex gap-2">
                {socials.map(({ Icon, url }, i) => (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="social"
                    className="p-2.5 rounded-full hairline hover:border-foreground transition"
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
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
                title={`${storeName} location`}
                src={mapsSrc}
                className="absolute inset-0 h-full w-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <MapPin className="size-3.5" /> {settings.address || "New Delhi · India"}
            </div>
            {settings.phone && (
              <div className="mt-1 text-xs text-ink-soft">{settings.phone}</div>
            )}
            {settings.email && (
              <div className="mt-1 text-xs text-ink-soft">{settings.email}</div>
            )}
            {settings.hours && (
              <div className="mt-1 text-xs text-ink-soft">{settings.hours}</div>
            )}
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <div>© {new Date().getFullYear()} {storeName}. All rights reserved.</div>
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