import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type Inquiry } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Download, Search, Phone } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/inquiries")({ component: InquiriesPage });

const STATUSES = ["New", "Contacted", "Reserved", "Sold", "Cancelled"] as const;

function empty(): Inquiry {
  return { id: newId(), customer: "", phone: "", date: new Date().toISOString(), source: "Website", status: "New" };
}

function InquiriesPage() {
  const inqs = useAdmin((s) => s.inquiries);
  const products = useAdmin((s) => s.products);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [editing, setEditing] = useState<Inquiry | null>(null);

  const filtered = useMemo(() => inqs.filter((i) => {
    if (status !== "all" && i.status !== status) return false;
    if (q) { const t = q.toLowerCase(); if (![i.customer, i.phone, i.productName || ""].some((v) => v.toLowerCase().includes(t))) return false; }
    return true;
  }), [inqs, q, status]);

  const exportCSV = () => {
    const rows = [["Customer", "Phone", "Product", "Source", "Date", "Status", "Notes"]];
    filtered.forEach((i) => rows.push([i.customer, i.phone, i.productName || "", i.source, new Date(i.date).toLocaleString(), i.status, i.notes || ""]));
    const csv = rows.map((r) => r.map((v) => `"${(v || "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `inquiries-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader title="Customer Inquiries" description="WhatsApp, walk-in and phone leads."
        actions={<><Button variant="outline" size="sm" onClick={exportCSV}><Download className="size-4" /> Export</Button>
          <Button size="sm" onClick={() => setEditing(empty())}><Plus className="size-4" /> New inquiry</Button></>} />
      <div className="rounded-xl border bg-card">
        <div className="p-3 border-b flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search customer, phone, product…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
          </div>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40 h-9"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="all">All statuses</SelectItem>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader><TableRow>
              <TableHead>Customer</TableHead><TableHead>Phone</TableHead><TableHead>Product</TableHead>
              <TableHead>Source</TableHead><TableHead>Date</TableHead><TableHead>Status</TableHead><TableHead className="w-16"></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {filtered.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium text-sm">{i.customer}</TableCell>
                  <TableCell className="text-sm"><a href={`tel:${i.phone}`} className="inline-flex items-center gap-1 hover:underline"><Phone className="size-3" /> {i.phone}</a></TableCell>
                  <TableCell className="text-sm text-muted-foreground">{i.productName || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{i.source}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(i.date).toLocaleString()}</TableCell>
                  <TableCell>
                    <Select value={i.status} onValueChange={(v) => admin.saveInquiry({ ...i, status: v as Inquiry["status"] })}>
                      <SelectTrigger className="w-32 h-8"><SelectValue /></SelectTrigger>
                      <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(i)}><Pencil className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => { admin.deleteInquiry(i.id); toast.success("Deleted"); }}><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && <TableRow><TableCell colSpan={7}><div className="py-12 text-center text-sm text-muted-foreground">No inquiries match.</div></TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.customer ? "Edit inquiry" : "New inquiry"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-4 space-y-3">
              <F label="Customer"><Input value={editing.customer} onChange={(e) => setEditing({ ...editing, customer: e.target.value })} /></F>
              <F label="Phone"><Input value={editing.phone} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} /></F>
              <F label="Product">
                <Select value={editing.productId || ""} onValueChange={(v) => { const p = products.find((x) => x.id === v); setEditing({ ...editing, productId: v, productName: p?.name }); }}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Source">
                <Select value={editing.source} onValueChange={(v) => setEditing({ ...editing, source: v as Inquiry["source"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Website", "Walk-in", "Phone"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Status">
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as Inquiry["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Notes"><Textarea rows={4} value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} /></F>
            </div>
          )}
          <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => { if (editing) { admin.saveInquiry(editing); setEditing(null); toast.success("Saved"); } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}