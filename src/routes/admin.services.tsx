import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type Service } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Plus, Pencil, Trash2, Wrench } from "lucide-react";
import { adminToast } from "@/lib/admin-toast";

export const Route = createFileRoute("/admin/services")({ component: ServicesPage });

function ServicesPage() {
  const services = useAdmin((s) => s.services);
  const [editing, setEditing] = useState<Service | null>(null);
  return (
    <>
      <PageHeader title="Services" description="Repair & upgrade services shown on the site."
        actions={<Button size="sm" onClick={() => setEditing({ id: newId(), title: "", description: "", icon: "Wrench", featured: false, order: services.length })}><Plus className="size-4" /> Add</Button>} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...services].sort((a, b) => a.order - b.order).map((s) => (
          <div key={s.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="size-9 grid place-items-center rounded-lg bg-primary/10 text-primary"><Wrench className="size-4" /></span>
                <div>
                  <div className="font-medium text-sm">{s.title}</div>
                  {s.featured && <span className="text-[10px] uppercase tracking-wider text-amber-600">Featured</span>}
                </div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(s)}><Pencil className="size-4" /></Button>
                <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={async () => { const ok = await admin.deleteService(s.id); if (ok) { adminToast.success("Service deleted", { description: "The service was removed." }); } else { adminToast.error("Service could not be deleted", { description: "Please try again." }); } }}><Trash2 className="size-4" /></Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3 line-clamp-3">{s.description}</p>
          </div>
        ))}
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>{editing?.title ? "Edit service" : "New service"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-4 space-y-3">
              <F label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></F>
              <F label="Description"><Textarea rows={4} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} /></F>
              <F label="Icon (lucide name)"><Input value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} /></F>
              <F label="Order"><Input type="number" value={editing.order} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></F>
              <label className="inline-flex items-center gap-2 text-sm"><Checkbox checked={editing.featured} onCheckedChange={(v) => setEditing({ ...editing, featured: !!v })} /> Featured</label>
            </div>
          )}
          <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={async () => { if (editing) { const ok = await admin.saveService(editing); setEditing(null); if (ok) { adminToast.success(editing.id ? "Service updated" : "Service added", { description: editing.title || "The service has been saved." }); } else { adminToast.error("Service could not be saved", { description: "Please try again." }); } } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}