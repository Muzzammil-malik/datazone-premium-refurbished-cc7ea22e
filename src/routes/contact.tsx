import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Clock, MessageCircle, Instagram, Youtube, Facebook, Linkedin, Globe, Send, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAdmin, admin, type Settings } from "@/lib/admin-store";
import { getMapEmbedUrl, getMapClickUrl } from "@/lib/map-utils";

function OlxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.5 5C4.46 5 2 7.46 2 10.5S4.46 16 7.5 16 13 13.54 13 10.5 10.54 5 7.5 5zm0 8.5C5.57 13.5 4 12.04 4 10.5S5.57 7.5 7.5 7.5 11 8.96 11 10.5 9.43 13.5 7.5 13.5zM22 7h-2.5l-2 3-2-3H13l3.25 4.5L13 16h2.5l2-3 2 3H22l-3.25-4.5L22 7z" />
    </svg>
  );
}

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — DATAZONe" },
      { name: "description", content: "Talk to DATAZONe. Phone, email, WhatsApp and our store address — we're here to help." },
      { property: "og:title", content: "Contact — DATAZONe" },
      { property: "og:description", content: "Get in touch with the DATAZONe team." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem('name') as HTMLInputElement).value;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const phone = (form.elements.namedItem('phone') as HTMLInputElement).value;
    const subject = (form.elements.namedItem('subject') as HTMLInputElement).value;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;

    await admin.saveInquiry({
      id: `dz-${Date.now()}`,
      customer: name,
      phone: phone || email,
      date: new Date().toISOString(),
      source: "Website",
      status: "New",
      notes: `Subject: ${subject}\n\nMessage: ${message}\n\nEmail: ${email}`,
    });

    setSent(true);
    form.reset();
  };

  return (
    <div className="container-dz py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow">Contact</div>
        <h1 className="display-xl mt-4">Say hello.</h1>
        <p className="mt-5 text-ink-soft text-lg">We reply to every message. Usually within an hour.</p>
      </div>

      <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_1fr]">
        <Reveal>
          <form
            onSubmit={handleSubmit}
            className="hairline rounded-3xl p-8 md:p-10 bg-background"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" id="name"><input id="name" required className="input" placeholder="Your full name" /></Field>
              <Field label="Email" id="email"><input id="email" type="email" required className="input" placeholder="you@company.com" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Phone" id="phone"><input id="phone" type="tel" className="input" placeholder="+91 98765 43210" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Subject" id="subject"><input id="subject" className="input" placeholder="What can we help with?" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Message" id="message"><textarea id="message" required rows={5} className="input resize-none" placeholder="Tell us a bit more…" /></Field>
            </div>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition">
              {sent ? "Thanks — we'll be in touch" : <>Send message <Send className="size-4" /></>}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="hairline rounded-3xl overflow-hidden aspect-[5/4] relative group">
              <iframe
                title="DATAZONe location"
                src={mapEmbedUrl}
                className="h-full w-full grayscale contrast-125 border-0 pointer-events-none"
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
            <div className="hairline rounded-3xl p-6 bg-background divide-y divide-hairline">
              <Row icon={MapPin} label="Address" value={settings.address || "—"} href={mapClickUrl} />
              <Row icon={Phone} label="Phone" value={settings.phone || "—"} />
              <Row icon={Mail} label="Email" value={settings.email || "—"} />
              <Row icon={MessageCircle} label="WhatsApp" value={settings.whatsapp || "—"} />
              <Row icon={Clock} label="Hours" value={settings.hours || "—"} />
            </div>
            <div className="flex gap-2">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer" aria-label={link.label} className="p-3 rounded-full hairline hover:border-foreground transition">
                    <Icon className="size-4" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        .input {
          width: 100%;
          border: 1px solid var(--color-hairline);
          border-radius: 12px;
          background: var(--color-background);
          padding: 12px 14px;
          font-size: 14px;
          transition: border-color .2s;
        }
        .input:focus { outline: none; border-color: var(--color-foreground); }
      `}</style>
    </div>
  );
}

function Field({ label, id, children }: { label: string; id: string; children: React.ReactNode }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs text-ink-soft">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

function Row({ icon: I, label, value, href }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string; href?: string }) {
  return (
    <div className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
      <div className="grid place-items-center size-10 rounded-full bg-surface shrink-0">
        <I className="size-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ink-soft">{label}</div>
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium hover:underline truncate block">
            {value}
          </a>
        ) : (
          <div className="text-sm font-medium truncate">{value}</div>
        )}
      </div>
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


















