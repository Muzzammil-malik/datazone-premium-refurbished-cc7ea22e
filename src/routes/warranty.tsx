import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { ShieldCheck, RotateCcw, Repeat, Headphones, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty & Returns — DATAZONe" },
      { name: "description", content: "1-month warranty, 7-day returns, hassle-free replacements and lifetime support on every DATAZONe device." },
      { property: "og:title", content: "Warranty & Returns — DATAZONe" },
      { property: "og:description", content: "1-month warranty, 7-day returns, hassle-free replacements." },
    ],
  }),
  component: Warranty,
});

const coverage = [
  {
    title: "What's Covered",
    type: "success" as const,
    icon: CheckCircle2,
    items: [
      "Motherboard and CPU failures",
      "RAM and storage defects",
      "Port and connector failures",
      "Pre-existing hardware faults",
    ],
  },
  {
    title: "Not Covered",
    type: "danger" as const,
    icon: XCircle,
    items: [
      "Physical damage from drops or impact",
      "Liquid or water damage",
      "Unauthorized modifications or repairs",
      "Software issues or virus damage",
      "Normal wear and tear",
      "Theft or loss",
    ],
  },
];

const timeline = [
  {
    icon: ShieldCheck,
    title: "Report the Issue",
    body: "Contact our support team via phone, WhatsApp, or email with your order ID and issue description.",
    badge: "Day 0",
    duration: "Day 0",
  },
  {
    icon: RotateCcw,
    title: "Diagnosis",
    body: "Our technician reviews your case and confirms warranty eligibility.",
    badge: "1–2 Days",
    duration: "1–2 Days",
  },
  {
    icon: Repeat,
    title: "Device Collection",
    body: "We arrange free doorstep pickup for assessment.",
    badge: "2–3 Days",
    duration: "2–3 Days",
  },
  {
    icon: Headphones,
    title: "Repair or Replacement",
    body: "Your device is repaired or replaced with an equivalent or better unit.",
    badge: "5–7 Days",
    duration: "5–7 Days",
  },
  {
    icon: Sparkles,
    title: "Delivery",
    body: "Once the assessment is completed, the repaired or replacement device is sent back to you.",
    badge: "7–10 Days",
    duration: "7–10 Days",
  },
];

function Warranty() {
  return (
    <div className="container-dz py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow">Warranty</div>
        <h1 className="display-lg mt-3">Buy with quiet confidence.</h1>
        <p className="mt-5 text-ink-soft text-lg">
          Refurbished shouldn't mean uncertain. Here's exactly what we promise, and how we deliver on it.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        {coverage.map((card, index) => (
          <Reveal key={card.title} delay={index * 0.06}>
            <div className={`rounded-3xl border p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${card.type === "success" ? "border-emerald-200 bg-emerald-50/70" : "border-rose-200 bg-rose-50/70"}`}>
              <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${card.type === "success" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                <card.icon className="size-4" strokeWidth={1.8} />
                {card.title}
              </div>
              <ul className="mt-5 space-y-3 text-sm text-ink-soft">
                {card.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className={`mt-0.5 ${card.type === "success" ? "text-emerald-600" : "text-rose-600"}`}>
                      {card.type === "success" ? <CheckCircle2 className="size-4" strokeWidth={1.8} /> : <XCircle className="size-4" strokeWidth={1.8} />}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.12}>
        <div className="mt-8 rounded-3xl border border-border bg-background/90 p-6 shadow-sm md:p-8">
          <div className="flex items-center gap-2 text-sm font-medium text-ink-soft">
            <RotateCcw className="size-4" strokeWidth={1.7} />
            <span>7-Day Return Policy</span>
          </div>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight">Not satisfied? Return it within 7 days.</h2>
          <p className="mt-3 max-w-2xl text-ink-soft leading-relaxed">
            Return your purchase within 7 days of delivery for a full refund or exchange—no questions asked. The device must be in its original condition.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 max-w-4xl mx-auto">
        <div className="max-w-2xl">
          <div className="eyebrow">Warranty claim process</div>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">A simple, guided path from issue to resolution.</h2>
        </div>

        <div className="mt-10 relative">
          <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-hairline" />
          {timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="relative grid grid-cols-[auto_1fr] gap-5 md:gap-6 pb-10 last:pb-0">
                <div className="relative z-10 grid place-items-center size-12 rounded-full bg-background hairline text-sm font-semibold">
                  {i + 1}
                </div>
                <div className="rounded-3xl border border-border bg-background p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-ink-soft">
                      <t.icon className="size-3.5" strokeWidth={1.7} />
                      {t.badge}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight">{t.title}</h3>
                  <p className="mt-2 text-ink-soft leading-relaxed">{t.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}


