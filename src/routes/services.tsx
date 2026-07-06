import { createFileRoute } from "@tanstack/react-router";
import {
  Wrench, HardDrive, MemoryStick, Monitor, ShieldAlert, Database, Bug, Building2, Package, Cpu,
  ArrowUpRight, Laptop, Smartphone, ShieldCheck, Headphones, Cog, Zap,
} from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { useAdmin } from "@/lib/admin-store";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — DATAZONe IT Repair & Upgrades" },
      { name: "description", content: "Computer & laptop repair, SSD/RAM upgrades, Windows installs, data recovery, virus removal, AMC and corporate IT solutions." },
      { property: "og:title", content: "Services — DATAZONe" },
      { property: "og:description", content: "Expert IT services from certified technicians." },
    ],
  }),
  component: Services,
});

const ICONS: Record<string, any> = {
  Wrench, HardDrive, MemoryStick, Monitor, ShieldAlert, Database, Bug, Building2, Package, Cpu,
  Laptop, Smartphone, ShieldCheck, Headphones, Cog, Zap,
};

const defaultServices = [
  { icon: Monitor, title: "Computer Repair", body: "Diagnostics and fixes for desktops of every brand." },
  { icon: Wrench, title: "Laptop Repair", body: "Board-level repair, screen and keyboard replacement." },
  { icon: MemoryStick, title: "RAM Upgrade", body: "Speed up your machine with expert-installed memory." },
  { icon: HardDrive, title: "SSD Upgrade", body: "Migrate to SSD without losing your data or time." },
  { icon: Cpu, title: "Windows Installation", body: "Genuine Windows installs, drivers, and optimisation." },
  { icon: Database, title: "Data Recovery", body: "Rescue lost files from drives, SSDs and RAID arrays." },
  { icon: Bug, title: "Virus Removal", body: "Complete malware cleanup and future-proofing." },
  { icon: ShieldAlert, title: "Annual Maintenance", body: "Yearly AMC plans that keep everything running." },
  { icon: Building2, title: "Corporate IT", body: "Fleet management, procurement and support for teams." },
  { icon: Package, title: "Bulk Orders", body: "Volume pricing for schools, offices and startups." },
];

function Services() {
  const dbServices = useAdmin((s) => s.services);
  const services =
    dbServices.length > 0
      ? [...dbServices]
          .sort((a, b) => a.order - b.order)
          .map((s) => ({
            icon: ICONS[s.icon] ?? Wrench,
            title: s.title,
            body: s.description,
          }))
      : defaultServices;
  return (
    <div className="container-dz py-16 md:py-24">
      <div className="max-w-3xl">
        <div className="eyebrow">Services</div>
        <h1 className="display-lg mt-3">Care beyond the sale.</h1>
        <p className="mt-5 text-ink-soft text-lg leading-relaxed">
          From same-day repairs to full IT partnerships, our certified engineers keep
          your technology quietly working — so you don't have to think about it.
        </p>
      </div>

      <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.04}>
            <div className="group hairline rounded-3xl p-8 h-full hover-lift bg-background relative overflow-hidden">
              <div className="grid place-items-center size-11 rounded-2xl bg-surface">
                <s.icon className="size-5" strokeWidth={1.5} />
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft leading-relaxed">{s.body}</p>
              <ArrowUpRight className="absolute top-6 right-6 size-4 opacity-0 group-hover:opacity-100 transition" />
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}


















