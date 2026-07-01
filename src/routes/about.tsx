import { createFileRoute, Link } from "@tanstack/react-router";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";
import refurb from "@/assets/refurb-process.jpg";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — DATAZONe" },
      { name: "description", content: "DATAZONe restores premium refurbished computers with expert care — for students, developers, offices and creators." },
      { property: "og:title", content: "About — DATAZONe" },
      { property: "og:description", content: "Trust, transparency and performance in every refurbished device." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="pb-24">
      <section className="container-dz pt-16 md:pt-24">
        <div className="max-w-4xl">
          <div className="eyebrow">About us</div>
          <h1 className="display-xl mt-4">Technology, restored with intention.</h1>
          <p className="mt-6 max-w-2xl text-ink-soft text-lg leading-relaxed">
            DATAZONe exists to give great computers a second life — and to give
            students, developers, offices and creators access to premium hardware
            without the premium price.
          </p>
        </div>
      </section>

      <section className="container-dz mt-16 md:mt-24">
        <div className="rounded-3xl overflow-hidden hairline">
          <img src={refurb} alt="Inside a DATAZONe refurbishment workshop" loading="lazy" className="w-full h-auto" />
        </div>
      </section>

      <section className="container-dz mt-24 grid gap-16 lg:grid-cols-2 lg:gap-24">
        <Reveal>
          <div>
            <div className="eyebrow">Our belief</div>
            <h2 className="display-lg mt-3">Nothing beautiful should be disposable.</h2>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="text-ink-soft text-lg leading-relaxed space-y-6">
            <p>Every device we touch is a small stand against a throwaway culture. It's the reason we obsess over every port, every cell, every pixel — because the difference between good and great is measured in patience.</p>
            <p>We're a small team of engineers, technicians and designers who believe great work quietly speaks for itself. That's why our warranty is longer than most, our support is human, and our packaging is quieter than most reveals.</p>
          </div>
        </Reveal>
      </section>

      <section className="container-dz mt-24">
        <div className="hairline rounded-3xl p-10 md:p-16 bg-surface grid gap-10 sm:grid-cols-3">
          {[
            { n: 8, s: "+", l: "Years in business" },
            { n: 12500, s: "+", l: "Devices restored" },
            { n: 4200, s: "+", l: "Happy customers" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-5xl md:text-6xl font-bold tracking-tight"><Counter to={s.n} suffix={s.s} /></div>
              <div className="mt-2 text-sm text-ink-soft">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-dz mt-24 text-center">
        <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition">
          Explore the collection <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}










