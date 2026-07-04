import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type Category } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, GripVertical, Pencil, Trash2, Check, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const categories = useAdmin((s) => s.categories);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const add = () => {
    if (!name.trim()) return;
    const c: Category = { id: newId(), name: name.trim(), slug: name.toLowerCase().replace(/\s+/g, "-"), order: categories.length, active: true };
    admin.saveCategory(c);
    setName("");
    toast.success("Category added");
  };

  const move = (id: string, dir: -1 | 1) => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex((c) => c.id === id);
    const swap = sorted[idx + dir];
    if (!swap) return;
    admin.saveCategory({ ...sorted[idx], order: swap.order });
    admin.saveCategory({ ...swap, order: sorted[idx].order });
  };

  return (
    <>
      <PageHeader title="Categories" description="Organize how products are grouped in the shop." />

      <div className="grid gap-4 md:grid-cols-[1fr_320px]">
        <div className="rounded-xl border bg-card">
          <ul className="divide-y">
            {[...categories].sort((a, b) => a.order - b.order).map((c) => (
              <li key={c.id} className="p-3 flex items-center gap-3">
                <button className="text-muted-foreground cursor-grab" onClick={() => move(c.id, -1)} title="Move up">
                  <GripVertical className="size-4" />
                </button>
                <Checkbox checked={c.active} onCheckedChange={(v) => admin.saveCategory({ ...c, active: !!v })} />
                {editingId === c.id ? (
                  <>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="h-8 max-w-xs" />
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => { admin.saveCategory({ ...c, name: editName, slug: editName.toLowerCase().replace(/\s+/g, "-") }); setEditingId(null); }}>
                      <Check className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => setEditingId(null)}>
                      <X className="size-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{c.name}</div>
                      <div className="text-xs text-muted-foreground">/{c.slug}</div>
                    </div>
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => { setEditingId(c.id); setEditName(c.name); }}>
                      <Pencil className="size-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => { admin.deleteCategory(c.id); toast.success("Deleted"); }}>
                      <Trash2 className="size-4" />
                    </Button>
                  </>
                )}
              </li>
            ))}
            {categories.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">No categories yet.</li>}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-4 h-fit">
          <div className="text-sm font-semibold mb-3">Add category</div>
          <Input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} />
          <Button className="w-full mt-3" onClick={add}><Plus className="size-4" /> Add</Button>
        </div>
      </div>
    </>
  );
}