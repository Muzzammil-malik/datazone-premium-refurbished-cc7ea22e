import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type Brand } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { adminToast } from "@/lib/admin-toast";

export const Route = createFileRoute("/admin/brands")({ component: BrandsPage });

function BrandsPage() {
  const brands = useAdmin((s) => s.brands);
  const [editing, setEditing] = useState<Brand | null>(null);
  return (
    <>
      <PageHeader title="Brands" description={`${brands.length} brands`}
        actions={<Button size="sm" onClick={() => setEditing({ id: newId(), name: "", description: "", logo: "", active: true })}><Plus className="size-4" /> Add brand</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {brands.map((b) => (
          <div key={b.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {b.logo ? <img src={b.logo} alt="" className="size-8 rounded object-contain bg-muted" /> :
                    <div className="size-8 rounded bg-muted grid place-items-center text-xs font-semibold">{b.name.slice(0, 2).toUpperCase()}</div>}
                  <div className="font-medium truncate">{b.name}</div>
                </div>
                <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{b.description}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(b)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => { admin.deleteBrand(b.id); adminToast.success("Brand deleted", { description: "The brand was removed." }); }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs">
              <span className={`size-1.5 rounded-full ${b.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
              <span className="text-muted-foreground">{b.active ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>{editing?.name ? "Edit brand" : "New brand"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-4 space-y-3">
              <F label="Name"><Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} /></F>
              <F label="Logo URL"><Input value={editing.logo || ""} onChange={(e) => setEditing({ ...editing, logo: e.target.value })} /></F>
              <F label="Description"><Textarea rows={3} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></F>
              <label className="inline-flex items-center gap-2 text-sm"><Checkbox checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: !!v })} /> Active</label>
            </div>
          )}
          <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => { if (editing) { admin.saveBrand(editing); setEditing(null); adminToast.success(editing.id ? "Brand updated" : "Brand added", { description: editing.name || "The brand has been saved." }); } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}