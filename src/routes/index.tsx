import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ShieldCheck, Cpu, Truck, Sparkles, Star, PackageCheck, Recycle } from "lucide-react";
import heroLaptop from "@/assets/hero-laptop.jpg";
import heroDesktop from "@/assets/hero-desktop.jpg";
import refurb from "@/assets/refurb-process.jpg";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { BrandMarquee } from "@/components/site/Marquee";
import { Reveal } from "@/components/site/Reveal";
import { Counter } from "@/components/site/Counter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DATAZONe — Premium Refurbished Computers, Trusted." },
      { name: "description", content: "Refurbished laptops, desktops, monitors and accessories from HP, Dell, Lenovo, ASUS. 100-point inspection, warranty included, expert tested." },
      { property: "og:title", content: "DATAZONe — Premium Refurbished Computers" },
      { property: "og:description", content: "Certified refurbished technology. Inspected. Warrantied. Delivered." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <WhyDatazone />
      <FeaturedProducts />
      <Categories />
      <RefurbishmentProcess />
      <Stats />
      <BrandsSection />
      <CTA />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  return (
    <section ref={ref} className="relative overflow-hidden pt-20 md:pt-28">
      <div className="container-dz">
        <motion.div style={{ y, opacity }} className="text-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 hairline rounded-full px-3 py-1.5 text-xs text-ink-soft"
          >
            <Sparkles className="size-3" /> Certified refurbished · 100-point inspection
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.2, 0.8, 0.2, 1] }}
            className="display-xl mt-6"
          >
            Serious tech.
            <br />
            <span className="text-ink-soft">Sensible price.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25 }}
            className="mt-6 max-w-xl mx-auto text-base md:text-lg text-ink-soft"
          >
            Refurbished laptops, desktops and monitors from the brands you trust —
            restored to like-new, warrantied for life at work.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link to="/shop" className="group inline-flex items-center gap-2 rounded-full bg-foreground text-background px-6 py-3 text-sm font-medium hover:opacity-90 transition">
              Shop Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-full hairline px-6 py-3 text-sm font-medium hover:border-foreground transition">
              Explore Collection
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative mt-16 md:mt-24 mx-auto max-w-6xl"
        >
          <div className="relative aspect-[16/10] rounded-3xl overflow-hidden bg-surface hairline">
            <img
              src={heroLaptop}
              alt="Premium refurbished laptop on studio white background"
              width={1600}
              height={1000}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <div className="eyebrow">Featured</div>
                <div className="mt-1 text-xl md:text-2xl font-semibold tracking-tight">ThinkPad X1 Carbon · Grade A+</div>
              </div>
              <Link to="/product/$id" params={{ id: "dz-thinkpad-x1" }} className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm">
                View <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TrustBar() {
  const items = [
    { icon: ShieldCheck, label: "1-Year Warranty" },
    { icon: PackageCheck, label: "100-Point Inspection" },
    { icon: Truck, label: "Free Shipping · Pan India" },
    { icon: Recycle, label: "7-Day Easy Returns" },
  ];
  return (
    <section className="container-dz mt-20 md:mt-32">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-hairline rounded-2xl overflow-hidden hairline">
        {items.map(({ icon: Icon, label }) => (
          <div key={label} className="bg-background p-6 flex items-center gap-3">
            <div className="grid place-items-center size-10 rounded-full bg-surface">
              <Icon className="size-4" strokeWidth={1.5} />
            </div>
            <div className="text-sm font-medium">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function WhyDatazone() {
  const items = [
    { title: "Inspected by experts", body: "Every unit passes a 100-point diagnostic covering battery, display, ports, storage, thermals and more.", icon: Cpu },
    { title: "Warranty, always", body: "Every purchase includes a 1-year DATAZONe warranty and 7-day no-questions returns.", icon: ShieldCheck },
    { title: "Fair, transparent grading", body: "Grade A+, A, and B — with real photos and honest condition notes, never surprises.", icon: Star },
  ];
  return (
    <section className="container-dz mt-28 md:mt-40">
      <Reveal>
        <div className="max-w-2xl">
          <div className="eyebrow">Why DATAZONe</div>
          <h2 className="display-lg mt-3">Refurbished, redefined.</h2>
          <p className="mt-5 text-ink-soft text-lg leading-relaxed">
            We treat pre-loved computers with the same care as new ones — because
            technology deserves a second life, and you deserve the savings.
          </p>
        </div>
      </Reveal>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.08}>
            <div className="hairline rounded-3xl p-8 h-full hover-lift bg-background">
              <div className="grid place-items-center size-11 rounded-2xl bg-surface">
                <f.icon className="size-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{f.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function FeaturedProducts() {
  const featured = products.slice(0, 4);
  return (
    <section className="container-dz mt-28 md:mt-40">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <Reveal>
          <div>
            <div className="eyebrow">Best sellers</div>
            <h2 className="display-lg mt-3">Loved by professionals.</h2>
          </div>
        </Reveal>
        <Link to="/shop" className="text-sm inline-flex items-center gap-1.5 hover:gap-2 transition-all">
          View all <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  );
}

function Categories() {
  const cats = [
    { label: "Laptops", count: "120+", img: heroLaptop },
    { label: "Desktops", count: "45+", img: heroDesktop },
    { label: "Monitors", count: "60+", img: heroDesktop },
    { label: "Accessories", count: "200+", img: heroLaptop },
  ];
  return (
    <section className="container-dz mt-28 md:mt-40">
      <Reveal>
        <div className="max-w-2xl">
          <div className="eyebrow">Categories</div>
          <h2 className="display-lg mt-3">Find what you need.</h2>
        </div>
      </Reveal>
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cats.map((c, i) => (
          <Reveal key={c.label} delay={i * 0.06}>
            <Link to="/shop" className="group relative block aspect-[3/4] rounded-3xl overflow-hidden hairline">
              <img src={c.img} alt={c.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between">
                <div>
                  <div className="text-lg font-semibold tracking-tight">{c.label}</div>
                  <div className="text-xs text-ink-soft">{c.count} products</div>
                </div>
                <div className="grid place-items-center size-9 rounded-full bg-foreground text-background translate-x-0 group-hover:translate-x-1 transition">
                  <ArrowRight className="size-4" />
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function RefurbishmentProcess() {
  const steps = [
    { n: "01", t: "Source", d: "Devices sourced from enterprise fleets and verified partners." },
    { n: "02", t: "Inspect", d: "100-point diagnostic across every subsystem." },
    { n: "03", t: "Restore", d: "Parts replaced with OEM-grade components. Deep cleaned." },
    { n: "04", t: "Certify", d: "Reimaged, benchmarked, sealed and warrantied." },
  ];
  return (
    <section className="container-dz mt-28 md:mt-40">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-start">
        <Reveal>
          <div className="rounded-3xl overflow-hidden hairline sticky top-24">
            <img src={refurb} alt="Technician inspecting a laptop motherboard" loading="lazy" className="w-full h-auto" />
          </div>
        </Reveal>
        <div>
          <Reveal>
            <div className="eyebrow">The process</div>
            <h2 className="display-lg mt-3">Every device, a ritual.</h2>
            <p className="mt-5 text-ink-soft text-lg leading-relaxed max-w-md">
              Four disciplined stages transform pre-loved technology into
              certified DATAZONe hardware.
            </p>
          </Reveal>
          <div className="mt-12 space-y-px bg-hairline hairline rounded-2xl overflow-hidden">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.05}>
                <div className="bg-background p-6 md:p-8 grid grid-cols-[auto_1fr] gap-6 items-start">
                  <div className="text-sm font-mono text-ink-soft">{s.n}</div>
                  <div>
                    <div className="text-lg font-semibold tracking-tight">{s.t}</div>
                    <div className="mt-1 text-sm text-ink-soft">{s.d}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const stats = [
    { n: 12500, s: "+", l: "Devices restored" },
    { n: 99, s: "%", l: "Customer satisfaction" },
    { n: 100, s: "-pt", l: "Inspection process" },
    { n: 24, s: "h", l: "Support response" },
  ];
  return (
    <section className="container-dz mt-28 md:mt-40">
      <div className="hairline rounded-3xl p-10 md:p-16 bg-surface">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.l}>
              <div className="text-5xl md:text-6xl font-bold tracking-tight">
                <Counter to={s.n} suffix={s.s} />
              </div>
              <div className="mt-2 text-sm text-ink-soft">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrandsSection() {
  return (
    <section className="mt-28 md:mt-40">
      <div className="container-dz">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto">
            <div className="eyebrow">Trusted brands</div>
            <h2 className="display-lg mt-3">The names you know.</h2>
          </div>
        </Reveal>
      </div>
      <div className="mt-12">
        <BrandMarquee />
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="container-dz mt-28 md:mt-40">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-foreground text-background p-10 md:p-20 text-center">
          <div className="absolute inset-0 opacity-40" style={{ background: "radial-gradient(600px circle at 30% 20%, oklch(0.62 0.204 258 / 0.35), transparent 60%), radial-gradient(500px circle at 80% 80%, oklch(0.7 0.15 200 / 0.25), transparent 60%)" }} />
          <div className="relative">
            <h2 className="display-lg">Ready to upgrade thoughtfully?</h2>
            <p className="mt-5 max-w-xl mx-auto text-white/70 text-lg">
              Browse the collection, or talk to an expert — we'll help you find the right machine.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/shop" className="inline-flex items-center gap-2 rounded-full bg-background text-foreground px-6 py-3 text-sm font-medium hover:opacity-90 transition">
                Shop Now <ArrowRight className="size-4" />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-medium hover:border-white transition">
                Talk to us
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
