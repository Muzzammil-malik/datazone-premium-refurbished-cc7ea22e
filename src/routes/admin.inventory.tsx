import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader, StatCard } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type InventoryRecord } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Boxes, PackageCheck, Wrench, PackageX } from "lucide-react";
import { adminToast } from "@/lib/admin-toast";

export const Route = createFileRoute("/admin/inventory")({ component: InventoryPage });

function empty(): InventoryRecord {
  return { id: newId(), serial: "", supplier: "", purchaseDate: new Date().toISOString().slice(0, 10), qcStatus: "Pending", shelf: "", status: "Available" };
}

function InventoryPage() {
  const inv = useAdmin((s) => s.inventory);
  const products = useAdmin((s) => s.products);
  const [editing, setEditing] = useState<InventoryRecord | null>(null);
  const stats = useMemo(() => ({
    total: inv.length,
    avail: inv.filter((i) => i.status === "Available").length,
    repair: inv.filter((i) => i.status === "Under Repair").length,
    sold: inv.filter((i) => i.status === "Sold").length,
  }), [inv]);
  return (
    <>
      <PageHeader title="Inventory" description="Track every serialized refurbished unit."
        actions={<Button size="sm" onClick={() => setEditing(empty())}><Plus className="size-4" /> Add unit</Button>} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <StatCard label="Total units" value={stats.total} icon={Boxes} />
        <StatCard label="Available" value={stats.avail} icon={PackageCheck} tone="positive" />
        <StatCard label="Under repair" value={stats.repair} icon={Wrench} tone="warning" />
        <StatCard label="Sold" value={stats.sold} icon={PackageX} />
      </div>
      <div className="rounded-xl border bg-card overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Serial</TableHead><TableHead>Product</TableHead><TableHead>Supplier</TableHead>
            <TableHead>Purchased</TableHead><TableHead>Battery</TableHead><TableHead>SSD</TableHead>
            <TableHead>QC</TableHead><TableHead>Shelf</TableHead><TableHead>Status</TableHead><TableHead className="w-16"></TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {inv.map((r) => {
              const p = products.find((x) => x.id === r.productId);
              return (
                <TableRow key={r.id}>
                  <TableCell className="font-mono text-xs">{r.serial}</TableCell>
                  <TableCell className="text-sm">{p?.name || <span className="text-muted-foreground">—</span>}</TableCell>
                  <TableCell className="text-sm">{r.supplier}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.purchaseDate}</TableCell>
                  <TableCell className="text-xs">{r.batteryHealth ? `${r.batteryHealth}%` : "—"}</TableCell>
                  <TableCell className="text-xs">{r.ssdHealth ? `${r.ssdHealth}%` : "—"}</TableCell>
                  <TableCell><Badge variant={r.qcStatus === "Passed" ? "secondary" : r.qcStatus === "Failed" ? "destructive" : "outline"}>{r.qcStatus}</Badge></TableCell>
                  <TableCell className="text-xs">{r.shelf}</TableCell>
                  <TableCell><Badge variant={r.status === "Available" ? "secondary" : r.status === "Under Repair" ? "destructive" : "outline"}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(r)}><Pencil className="size-4" /></Button>
                      <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={async () => { const ok = await admin.deleteInventory(r.id); if (ok) { adminToast.success("Inventory removed", { description: "The record was deleted." }); } else { adminToast.error("Inventory record could not be deleted", { description: "Please try again." }); } }}><Trash2 className="size-4" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {inv.length === 0 && <TableRow><TableCell colSpan={10}><div className="py-12 text-center text-sm text-muted-foreground">No inventory records.</div></TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.serial ? "Edit unit" : "New unit"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <F label="Serial number"><Input value={editing.serial} onChange={(e) => setEditing({ ...editing, serial: e.target.value })} /></F>
              <F label="Product">
                <Select value={editing.productId || ""} onValueChange={(v) => setEditing({ ...editing, productId: v })}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>{products.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Supplier"><Input value={editing.supplier} onChange={(e) => setEditing({ ...editing, supplier: e.target.value })} /></F>
              <F label="Purchase date"><Input type="date" value={editing.purchaseDate} onChange={(e) => setEditing({ ...editing, purchaseDate: e.target.value })} /></F>
              <F label="Battery health %"><Input type="number" value={editing.batteryHealth ?? ""} onChange={(e) => setEditing({ ...editing, batteryHealth: Number(e.target.value) })} /></F>
              <F label="SSD health %"><Input type="number" value={editing.ssdHealth ?? ""} onChange={(e) => setEditing({ ...editing, ssdHealth: Number(e.target.value) })} /></F>
              <F label="QC status">
                <Select value={editing.qcStatus} onValueChange={(v) => setEditing({ ...editing, qcStatus: v as InventoryRecord["qcStatus"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Pending", "Passed", "Failed"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <F label="Shelf"><Input value={editing.shelf} onChange={(e) => setEditing({ ...editing, shelf: e.target.value })} /></F>
              <F label="Availability">
                <Select value={editing.status} onValueChange={(v) => setEditing({ ...editing, status: v as InventoryRecord["status"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{["Available", "Reserved", "Sold", "Under Repair"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </F>
              <div className="col-span-2"><F label="Remarks"><Input value={editing.remarks || ""} onChange={(e) => setEditing({ ...editing, remarks: e.target.value })} /></F></div>
            </div>
          )}
          <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={async () => { if (editing) { const ok = await admin.saveInventory(editing); setEditing(null); if (ok) { adminToast.success(editing.id ? "Inventory updated" : "Inventory added", { description: editing.serial || "The unit record is saved." }); } else { adminToast.error("Inventory could not be saved", { description: "Please try again." }); } } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}