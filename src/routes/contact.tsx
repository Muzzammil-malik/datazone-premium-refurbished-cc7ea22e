import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Clock, MessageCircle, Instagram, Facebook, Youtube, Linkedin, Globe, Send, MapPin } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAdmin, newId, admin } from "@/lib/admin-store";
import { toast } from "sonner";
import { whatsappUrl } from "@/lib/whatsapp";

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
  const settings = useAdmin((s) => s.settings);
  const [sent, setSent] = useState(false);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") ?? "");
    const email = String(fd.get("email") ?? "");
    const subject = String(fd.get("subject") ?? "General");
    const message = String(fd.get("message") ?? "");
    try {
      await admin.saveInquiry({
        id: newId(),
        customer: name,
        phone: email,
        date: new Date().toISOString(),
        source: "Website",
        notes: `${subject}\n\n${message}`,
        status: "New",
      });
      setSent(true);
      toast.success("Message sent — we'll be in touch shortly.");
    } catch {
      toast.error("Could not send. Please WhatsApp us instead.");
    }
  }
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
              <Field label="Name" id="name"><input id="name" name="name" required className="input" placeholder="Your full name" /></Field>
              <Field label="Email" id="email"><input id="email" name="email" type="email" required className="input" placeholder="you@company.com" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Subject" id="subject"><input id="subject" name="subject" className="input" placeholder="What can we help with?" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Message" id="message"><textarea id="message" name="message" required rows={5} className="input resize-none" placeholder="Tell us a bit more…" /></Field>
            </div>
            <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition">
              {sent ? "Thanks — we'll be in touch" : <>Send message <Send className="size-4" /></>}
            </button>
          </form>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="space-y-6">
            <div className="hairline rounded-3xl overflow-hidden aspect-[5/4]">
              <iframe
                title={`${settings.storeName || "DATAZONe"} location`}
                src={mapsSrc}
                className="h-full w-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
            <div className="hairline rounded-3xl p-6 bg-background divide-y divide-hairline">
              {settings.phone && <Row icon={Phone} label="Phone" value={settings.phone} href={`tel:${settings.phone}`} />}
              {settings.email && <Row icon={Mail} label="Email" value={settings.email} href={`mailto:${settings.email}`} />}
              {settings.whatsapp && <Row icon={MessageCircle} label="WhatsApp" value="Chat now" href={whatsappUrl("Hi DATAZONe, I'd like to know more.")} />}
              {settings.address && <Row icon={MapPin} label="Address" value={settings.address} />}
              {settings.hours && <Row icon={Clock} label="Hours" value={settings.hours} />}
            </div>
            {socials.length > 0 && (
              <div className="flex gap-2">
                {socials.map(({ Icon, url }, i) => (
                  <a key={i} href={url} target="_blank" rel="noreferrer" aria-label="social" className="p-3 rounded-full hairline hover:border-foreground transition">
                    <Icon className="size-4" strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
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
  const inner = (
    <div className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
      <div className="grid place-items-center size-10 rounded-full bg-surface">
        <I className="size-4" strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-ink-soft">{label}</div>
        <div className="text-sm font-medium truncate">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="block hover:opacity-80 transition">
      {inner}
    </a>
  ) : inner;
}


















