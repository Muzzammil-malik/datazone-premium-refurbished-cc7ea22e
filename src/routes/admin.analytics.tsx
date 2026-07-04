import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { PageHeader, StatCard } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/admin-store";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, Legend } from "recharts";
import { Eye, MessagesSquare, Package, Award } from "lucide-react";

export const Route = createFileRoute("/admin/analytics")({ component: AnalyticsPage });
const COLORS = ["#0ea5e9", "#8b5cf6", "#f59e0b", "#10b981", "#ef4444", "#ec4899"];

function AnalyticsPage() {
  const products = useAdmin((s) => s.products);
  const inquiries = useAdmin((s) => s.inquiries);
  const monthly = useMemo(() => [
    { m: "Jan", inq: 32, views: 2400 }, { m: "Feb", inq: 38, views: 2800 },
    { m: "Mar", inq: 41, views: 3100 }, { m: "Apr", inq: 44, views: 2950 },
    { m: "May", inq: 52, views: 3600 }, { m: "Jun", inq: 61, views: 4200 },
    { m: "Jul", inq: 68, views: 4600 }, { m: "Aug", inq: 74, views: 5200 },
    { m: "Sep", inq: 71, views: 4800 }, { m: "Oct", inq: 82, views: 5600 },
    { m: "Nov", inq: 90, views: 6100 }, { m: "Dec", inq: 104, views: 6800 },
  ], []);
  const topViewed = useMemo(() => [...products].sort((a, b) => b.reviews - a.reviews).slice(0, 6).map((p) => ({ name: p.name.slice(0, 22), views: p.reviews * 12 })), [products]);
  const brandShare = useMemo(() => { const m = new Map<string, number>(); products.forEach((p) => m.set(p.brand, (m.get(p.brand) || 0) + 1)); return Array.from(m, ([name, value]) => ({ name, value })); }, [products]);
  const availability = useMemo(() => { const m = new Map<string, number>(); products.forEach((p) => m.set(p.availability, (m.get(p.availability) || 0) + 1)); return Array.from(m, ([name, value]) => ({ name, value })); }, [products]);
  return (
    <>
      <PageHeader title="Analytics" description="Traffic, engagement and inventory insights." />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total products" value={products.length} icon={Package} />
        <StatCard label="Total inquiries" value={inquiries.length} icon={MessagesSquare} />
        <StatCard label="Monthly views" value={"52,400"} icon={Eye} tone="positive" delta="+18.2%" />
        <StatCard label="Active brands" value={brandShare.length} icon={Award} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <C title="Traffic vs inquiries"><div className="h-64"><ResponsiveContainer><AreaChart data={monthly}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="m" className="text-xs" /><YAxis className="text-xs" /><Tooltip /><Area type="monotone" dataKey="views" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.15} /><Area type="monotone" dataKey="inq" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} /></AreaChart></ResponsiveContainer></div></C>
        <C title="Most viewed products"><div className="h-64"><ResponsiveContainer><BarChart data={topViewed} layout="vertical"><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis type="number" className="text-xs" /><YAxis dataKey="name" type="category" width={140} className="text-xs" /><Tooltip /><Bar dataKey="views" fill="#10b981" radius={[0, 4, 4, 0]} /></BarChart></ResponsiveContainer></div></C>
        <C title="Popular brands"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={brandShare} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>{brandShare.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></C>
        <C title="Product availability"><div className="h-64"><ResponsiveContainer><PieChart><Pie data={availability} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90}>{availability.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div></C>
      </div>
      <div className="mt-4"><C title="Monthly inquiries"><div className="h-64"><ResponsiveContainer><LineChart data={monthly}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="m" className="text-xs" /><YAxis className="text-xs" /><Tooltip /><Line type="monotone" dataKey="inq" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} /></LineChart></ResponsiveContainer></div></C></div>
    </>
  );
}
function C({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border bg-card p-5"><h3 className="text-sm font-semibold mb-4">{title}</h3>{children}</div>;
}