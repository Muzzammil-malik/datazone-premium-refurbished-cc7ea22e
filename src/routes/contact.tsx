import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Clock, MessageCircle, Instagram, Twitter, Linkedin, Send } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

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
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="hairline rounded-3xl p-8 md:p-10 bg-background"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Name" id="name"><input id="name" required className="input" placeholder="Your full name" /></Field>
              <Field label="Email" id="email"><input id="email" type="email" required className="input" placeholder="you@company.com" /></Field>
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
            <div className="hairline rounded-3xl overflow-hidden aspect-[5/4]">
              <iframe
                title="DATAZONe location"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.19%2C28.60%2C77.25%2C28.64&layer=mapnik"
                className="h-full w-full grayscale contrast-125"
                loading="lazy"
              />
            </div>
            <div className="hairline rounded-3xl p-6 bg-background divide-y divide-hairline">
              <Row icon={Phone} label="Phone" value="+91 99999 99999" />
              <Row icon={Mail} label="Email" value="hello@datazone.in" />
              <Row icon={MessageCircle} label="WhatsApp" value="Chat now" />
              <Row icon={Clock} label="Hours" value="Mon–Sat · 10am – 8pm" />
            </div>
            <div className="flex gap-2">
              {[Instagram, Twitter, Linkedin].map((I, i) => (
                <a key={i} href="#" aria-label="social" className="p-3 rounded-full hairline hover:border-foreground transition">
                  <I className="size-4" strokeWidth={1.5} />
                </a>
              ))}
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

function Row({ icon: I, label, value }: { icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; label: string; value: string }) {
  return (
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
}


















