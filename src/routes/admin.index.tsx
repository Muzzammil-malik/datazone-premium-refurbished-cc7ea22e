import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Package, PackageCheck, PackageX, MessagesSquare, Sparkles, Zap,
  TrendingUp, PlusCircle, Boxes, Star,
} from "lucide-react";
import { PageHeader, StatCard } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";
import { inr } from "@/lib/products";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const monthly = [
  { m: "Jan", views: 2400, inq: 32 },
  { m: "Feb", views: 2800, inq: 38 },
  { m: "Mar", views: 3100, inq: 41 },
  { m: "Apr", views: 2950, inq: 44 },
  { m: "May", views: 3600, inq: 52 },
  { m: "Jun", views: 4200, inq: 61 },
  { m: "Jul", views: 4600, inq: 68 },
  { m: "Aug", views: 5200, inq: 74 },
  { m: "Sep", views: 4800, inq: 71 },
  { m: "Oct", views: 5600, inq: 82 },
  { m: "Nov", views: 6100, inq: 90 },
  { m: "Dec", views: 6800, inq: 104 },
];

const CHART_COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899", "#6366f1"];

function Dashboard() {
  const products = useAdmin((s) => s.products);
  const inquiries = useAdmin((s) => s.inquiries);
  const activity = useAdmin((s) => s.activity);

  const stats = useMemo(() => {
    const inStock = products.filter((p) => p.availability !== "Out of stock").length;
    const oos = products.filter((p) => p.availability === "Out of stock").length;
    const newInq = inquiries.filter((i) => i.status === "New").length;
    const featured = products.filter((p) => p.featured).length;
    const arrivals = products.filter((p) => p.newArrival).length;
    return { total: products.length, inStock, oos, newInq, featured, arrivals };
  }, [products, inquiries]);

  const brandData = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.brand, (map.get(p.brand) || 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [products]);

  const catData = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [products]);

  const inventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + p.price, 0),
    [products],
  );

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="At-a-glance view of your store health and activity."
        actions={
          <Link to="/admin/products">
            <Button size="sm"><PlusCircle className="size-4" /> Add product</Button>
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        <StatCard label="Total Products" value={stats.total} icon={Package} />
        <StatCard label="In Stock" value={stats.inStock} icon={PackageCheck} tone="positive" />
        <StatCard label="Out of Stock" value={stats.oos} icon={PackageX} tone="danger" />
        <StatCard label="New Inquiries" value={stats.newInq} icon={MessagesSquare} tone="warning" delta="+12% this week" />
        <StatCard label="Featured" value={stats.featured} icon={Sparkles} />
        <StatCard label="New Arrivals" value={stats.arrivals} icon={Zap} />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Monthly product views</h3>
              <p className="text-xs text-muted-foreground">Traffic across all listings</p>
            </div>
            <span className="text-xs text-emerald-600 inline-flex items-center gap-1"><TrendingUp className="size-3" /> +18.2%</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="views" stroke="#0ea5e9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Inventory value</h3>
            <p className="text-xs text-muted-foreground">Total listed catalog</p>
          </div>
          <div className="text-3xl font-bold tracking-tight">{inr(inventoryValue)}</div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <MiniStat label="Live SKUs" value={stats.inStock} icon={Boxes} />
            <MiniStat label="Inquiries" value={inquiries.length} icon={MessagesSquare} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Monthly customer inquiries</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="m" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="inq" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Popular brands</h3>
          <div className="h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={brandData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80} paddingAngle={2}>
                  {brandData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 text-xs space-y-1">
            {brandData.slice(0, 5).map((b, i) => (
              <li key={b.name} className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2">
                  <span className="size-2 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  {b.name}
                </span>
                <span className="text-muted-foreground">{b.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-5">
          <h3 className="text-sm font-semibold mb-4">Popular categories</h3>
          <div className="space-y-3">
            {catData.map((c, i) => {
              const max = Math.max(...catData.map((x) => x.value));
              const pct = (c.value / max) * 100;
              return (
                <div key={c.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span>{c.name}</span>
                    <span className="text-muted-foreground">{c.value}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold">Recent activity</h3>
          <span className="text-xs text-muted-foreground">Last {activity.length} events</span>
        </div>
        <ul className="divide-y">
          {activity.map((a) => (
            <li key={a.id} className="py-3 flex items-center gap-3">
              <span className="size-8 grid place-items-center rounded-full bg-muted">
                {a.kind === "product.add" && <PlusCircle className="size-4 text-emerald-600" />}
                {a.kind === "product.update" && <Package className="size-4 text-sky-600" />}
                {a.kind === "inquiry.new" && <MessagesSquare className="size-4 text-violet-600" />}
                {a.kind === "review.new" && <Star className="size-4 text-amber-600" />}
                {a.kind === "banner.update" && <Sparkles className="size-4 text-pink-600" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm truncate">{a.message}</div>
                <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <Icon className="size-4 text-muted-foreground" />
      <div className="mt-2 text-lg font-semibold">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}