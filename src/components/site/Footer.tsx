import { Link } from "@tanstack/react-router";
import { Instagram, Youtube, Facebook, Linkedin, Globe, MapPin } from "lucide-react";
import { useAdmin, type Settings } from "@/lib/admin-store";
import { getMapEmbedUrl, getMapClickUrl } from "@/lib/map-utils";

// OLX SVG icon component (no lucide icon exists)
function OlxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 5C4.46 5 2 7.46 2 10.5S4.46 16 7.5 16 13 13.54 13 10.5 10.54 5 7.5 5zm0 8.5C5.57 13.5 4 12.04 4 10.5S5.57 7.5 7.5 7.5 11 8.96 11 10.5 9.43 13.5 7.5 13.5zM22 7h-2.5l-2 3-2-3H13l3.25 4.5L13 16h2.5l2-3 2 3H22l-3.25-4.5L22 7z" />
    </svg>
  );
}

export function Footer() {
  const settings = useAdmin((s) => s.settings);
  const mapEmbedUrl = getMapEmbedUrl(settings.mapsLink, settings.address);
  const mapClickUrl = getMapClickUrl(settings.mapsLink, settings.address);
  const socialLinks = [
    { href: normalizeSocialHref("instagram", settings.social.instagram), icon: Instagram, label: "Instagram" },
    { href: normalizeSocialHref("youtube", settings.social.youtube), icon: Youtube, label: "YouTube" },
    { href: normalizeSocialHref("facebook", settings.social.facebook), icon: Facebook, label: "Facebook" },
    { href: normalizeSocialHref("linkedin", settings.social.linkedin), icon: Linkedin, label: "LinkedIn" },
    { href: normalizeSocialHref("website", settings.social.website), icon: Globe, label: "Website" },
    { href: normalizeSocialHref("olx", settings.social.olx ?? ""), icon: OlxIcon, label: "OLX" },
  ].filter((link) => !!link.href);

  return (
    <footer className="mt-32 border-t border-hairline bg-surface">
      <div className="container-dz py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          <div>
            <div className="text-xl font-bold tracking-tight">
              {settings.storeName.replace(/\s+$/g, "")}
            </div>
            <p className="mt-4 max-w-xs text-sm text-ink-soft leading-relaxed">
              Premium refurbished computers, monitors and services — inspected,
              warrantied and delivered with care.
            </p>
            <div className="mt-6 flex gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.label}
                    className="p-2.5 rounded-full hairline hover:border-foreground transition"
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                  </a>
                );
              })}
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
            <div className="mt-4 aspect-[4/3] rounded-2xl overflow-hidden hairline relative bg-background group">
              <iframe
                title="DATAZONe location"
                src={mapEmbedUrl}
                className="absolute inset-0 h-full w-full grayscale contrast-125 border-0 pointer-events-none"
                loading="lazy"
              />
              {mapClickUrl && (
                <a
                  href={mapClickUrl}
                  target="_blank"
                  rel="noreferrer"
                  title="Open location on Google Maps"
                  className="absolute inset-0 z-10"
                />
              )}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
              <MapPin className="size-3.5 shrink-0" />
              {mapClickUrl ? (
                <a
                  href={mapClickUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground transition line-clamp-2"
                >
                  {settings.address || "Store location"}
                </a>
              ) : (
                <span>{settings.address || "Store location unavailable"}</span>
              )}
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-ink-soft">
          <div>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</div>
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

function normalizeSocialHref(platform: keyof Settings["social"], value: string) {
  const raw = (value ?? "").trim();
  if (!raw) return "";

  const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  const safe = normalized.replace(/\s+/g, "");

  switch (platform) {
    case "instagram":
      return safe.includes("instagram.com") ? safe : `https://instagram.com/${raw.replace(/^@/, "")}`;
    case "youtube":
      return safe.includes("youtube.com") ? safe : `https://youtube.com/${raw.replace(/^@/, "")}`;
    case "facebook":
      return safe.includes("facebook.com") ? safe : `https://facebook.com/${raw.replace(/^@/, "")}`;
    case "linkedin":
      return safe.includes("linkedin.com") ? safe : `https://linkedin.com/in/${raw.replace(/^@/, "")}`;
    case "olx":
      return safe.includes("olx.") ? safe : `https://www.olx.in/${raw.replace(/^\//, "")}`;
    case "website":
    default:
      return /^https?:\/\//i.test(safe) ? safe : `https://${safe}`;
  }
}