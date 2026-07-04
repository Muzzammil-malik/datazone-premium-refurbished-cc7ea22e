import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type Banner } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/banners")({ component: BannersPage });
const TYPES: Banner["type"][] = ["Homepage Hero", "Promotional", "Student Offers", "Seasonal Sale", "New Arrivals"];
function empty(): Banner { return { id: newId(), type: "Promotional", title: "", subtitle: "", cta: "", link: "", active: true }; }

function BannersPage() {
  const banners = useAdmin((s) => s.banners);
  const [editing, setEditing] = useState<Banner | null>(null);
  return (
    <>
      <PageHeader title="Banner Manager" description="Schedule and manage promotional banners."
        actions={<Button size="sm" onClick={() => setEditing(empty())}><Plus className="size-4" /> New banner</Button>} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map((b) => (
          <div key={b.id} className="rounded-xl border bg-card overflow-hidden">
            <div className="aspect-[16/6] bg-gradient-to-br from-primary/10 via-muted to-primary/5 relative">
              {b.image ? <img src={b.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> :
                <div className="absolute inset-0 grid place-items-center text-muted-foreground"><ImageIcon className="size-8" /></div>}
              <div className="absolute top-3 left-3 flex gap-1.5"><Badge>{b.type}</Badge>{b.active && <Badge variant="secondary">Active</Badge>}</div>
            </div>
            <div className="p-4">
              <div className="font-semibold">{b.title || "Untitled banner"}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{b.subtitle}</p>
              <div className="mt-3 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">CTA: {b.cta || "—"} → {b.link || "—"}</span>
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditing(b)}><Pencil className="size-4" /></Button>
                  <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => { admin.deleteBanner(b.id); toast.success("Deleted"); }}><Trash2 className="size-4" /></Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader><SheetTitle>{editing?.title ? "Edit banner" : "New banner"}</SheetTitle></SheetHeader>
          {editing && (
            <div className="mt-4 space-y-3">
              <F label="Type"><Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v as Banner["type"] })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></F>
              <F label="Image URL"><Input value={editing.image || ""} onChange={(e) => setEditing({ ...editing, image: e.target.value })} /></F>
              <F label="Title"><Input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} /></F>
              <F label="Subtitle"><Textarea rows={2} value={editing.subtitle} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} /></F>
              <div className="grid grid-cols-2 gap-3">
                <F label="CTA text"><Input value={editing.cta} onChange={(e) => setEditing({ ...editing, cta: e.target.value })} /></F>
                <F label="CTA link"><Input value={editing.link} onChange={(e) => setEditing({ ...editing, link: e.target.value })} /></F>
                <F label="Start"><Input type="date" value={editing.startDate || ""} onChange={(e) => setEditing({ ...editing, startDate: e.target.value })} /></F>
                <F label="End"><Input type="date" value={editing.endDate || ""} onChange={(e) => setEditing({ ...editing, endDate: e.target.value })} /></F>
              </div>
              <label className="inline-flex items-center gap-2 text-sm"><Checkbox checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: !!v })} /> Active</label>
            </div>
          )}
          <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={() => { if (editing) { admin.saveBanner(editing); setEditing(null); toast.success("Saved"); } }}>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}