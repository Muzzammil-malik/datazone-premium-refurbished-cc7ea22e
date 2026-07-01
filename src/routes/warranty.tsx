import { createFileRoute } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { ShieldCheck, RotateCcw, Repeat, Headphones } from "lucide-react";

export const Route = createFileRoute("/warranty")({
  head: () => ({
    meta: [
      { title: "Warranty & Returns — DATAZONe" },
      { name: "description", content: "1-year warranty, 7-day returns, hassle-free replacements and lifetime support on every DATAZONe device." },
      { property: "og:title", content: "Warranty & Returns — DATAZONe" },
      { property: "og:description", content: "1-year warranty, 7-day returns, hassle-free replacements." },
    ],
  }),
  component: Warranty,
});

const timeline = [
  { icon: ShieldCheck, title: "Warranty coverage", body: "Every device includes a comprehensive 1-year DATAZONe warranty covering hardware defects and functional issues." },
  { icon: RotateCcw, title: "Returns", body: "7-day easy returns, no questions asked. If it's not right, we make it right." },
  { icon: Repeat, title: "Replacement policy", body: "Dead-on-arrival units are replaced within 48 hours — no hoops, no waiting." },
  { icon: Headphones, title: "Support process", body: "Reach us on WhatsApp, email or phone. Real humans, average response under 2 hours." },
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

      <div className="mt-20 relative max-w-3xl mx-auto">
        <div className="absolute left-5 md:left-6 top-0 bottom-0 w-px bg-hairline" />
        {timeline.map((t, i) => (
          <Reveal key={t.title} delay={i * 0.08}>
            <div className="relative grid grid-cols-[auto_1fr] gap-6 pb-16 last:pb-0">
              <div className="relative z-10 grid place-items-center size-11 md:size-12 rounded-full bg-background hairline">
                <t.icon className="size-5" strokeWidth={1.5} />
              </div>
              <div className="pt-1">
                <div className="eyebrow">Step {String(i + 1).padStart(2, "0")}</div>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight">{t.title}</h3>
                <p className="mt-3 text-ink-soft leading-relaxed">{t.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}








