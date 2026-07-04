import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type AdminProduct } from "@/lib/admin-store";
import { inr } from "@/lib/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription,
} from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Pencil, Copy, Trash2, Archive, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function emptyProduct(): AdminProduct {
  return {
    id: `dz-${newId()}`,
    name: "",
    brand: "Dell",
    category: "Laptops",
    processor: "",
    ram: "",
    storage: "",
    gpu: "",
    price: 0,
    original: 0,
    condition: "Grade A",
    availability: "In stock",
    image: "",
    tagline: "",
    rating: 4.5,
    reviews: 0,
    active: true,
    featured: false,
    newArrival: true,
    images: [],
  };
}

function ProductsPage() {
  const products = useAdmin((s) => s.products);
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<AdminProduct | null>(null);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    if (!t) return products;
    return products.filter((p) =>
      [p.name, p.brand, p.category, p.processor].some((v) => v.toLowerCase().includes(t)),
    );
  }, [products, q]);

  const allSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  const bulkDelete = () => {
    if (!selected.length) return;
    selected.forEach((id) => admin.deleteProduct(id));
    setSelected([]);
    toast.success(`Deleted ${selected.length} products`);
  };

  return (
    <>
      <PageHeader
        title="Products"
        description={`${products.length} products in your catalog`}
        actions={
          <>
            <Button variant="outline" size="sm"><Download className="size-4" /> Export</Button>
            <Button size="sm" onClick={() => setEditing(emptyProduct())}>
              <Plus className="size-4" /> Add product
            </Button>
          </>
        }
      />

      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-2 p-3 border-b">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8 h-9" />
          </div>
          {selected.length > 0 && (
            <>
              <span className="text-xs text-muted-foreground">{selected.length} selected</span>
              <Button size="sm" variant="destructive" onClick={bulkDelete}>
                <Trash2 className="size-4" /> Delete
              </Button>
            </>
          )}
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={(v) =>
                      setSelected(v ? filtered.map((p) => p.id) : [])
                    }
                  />
                </TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden lg:table-cell">Processor</TableHead>
                <TableHead className="hidden lg:table-cell">RAM</TableHead>
                <TableHead className="hidden lg:table-cell">Storage</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Condition</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-8"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Checkbox
                      checked={selected.includes(p.id)}
                      onCheckedChange={(v) =>
                        setSelected((s) => (v ? [...s, p.id] : s.filter((x) => x !== p.id)))
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {p.image ? (
                        <img src={p.image} alt="" className="size-10 rounded-md object-cover border" />
                      ) : (
                        <div className="size-10 rounded-md bg-muted" />
                      )}
                      <div className="min-w-0">
                        <div className="font-medium text-sm truncate max-w-[220px]">{p.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[220px]">{p.tagline}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{p.brand}</TableCell>
                  <TableCell className="text-sm">{p.category}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{p.processor}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{p.ram}</TableCell>
                  <TableCell className="text-xs text-muted-foreground hidden lg:table-cell">{p.storage}</TableCell>
                  <TableCell className="text-sm font-medium">{inr(p.price)}</TableCell>
                  <TableCell><Badge variant="secondary">{p.condition}</Badge></TableCell>
                  <TableCell>
                    <Badge
                      variant={p.availability === "Out of stock" ? "destructive" : p.availability === "Low stock" ? "outline" : "secondary"}
                    >
                      {p.availability}
                    </Badge>
                  </TableCell>
                  <TableCell>{p.featured ? <Badge>★ Featured</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 text-xs ${p.active ? "text-emerald-600" : "text-muted-foreground"}`}>
                      <span className={`size-1.5 rounded-full ${p.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      {p.active ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8"><MoreHorizontal className="size-4" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditing({ ...p })}><Pencil className="size-3.5" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { admin.duplicateProduct(p.id); toast.success("Duplicated"); }}><Copy className="size-3.5" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { admin.saveProduct({ ...p, active: !p.active }); }}><Archive className="size-3.5" /> {p.active ? "Archive" : "Restore"}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => { admin.deleteProduct(p.id); toast.success("Deleted"); }}>
                          <Trash2 className="size-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={13}>
                    <div className="py-12 text-center text-sm text-muted-foreground">No products match your search.</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ProductForm
        product={editing}
        onClose={() => setEditing(null)}
        onSave={(p) => { admin.saveProduct(p); toast.success("Product saved"); setEditing(null); }}
      />
    </>
  );
}

function ProductForm({
  product, onClose, onSave,
}: { product: AdminProduct | null; onClose: () => void; onSave: (p: AdminProduct) => void }) {
  const [draft, setDraft] = useState<AdminProduct | null>(product);
  const brands = useAdmin((s) => s.brands);
  const categories = useAdmin((s) => s.categories);
  const set = (patch: Partial<AdminProduct>) => setDraft((d) => (d ? { ...d, ...patch } : d));

  // sync when opening a different product
  if (product && draft?.id !== product.id) setDraft(product);

  return (
    <Sheet open={!!product} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{product?.name ? "Edit product" : "New product"}</SheetTitle>
          <SheetDescription>Manage details, specs, media and visibility.</SheetDescription>
        </SheetHeader>

        {draft && (
          <div className="mt-4 space-y-6 pr-1">
            <Section title="Basic information">
              <Field label="Name"><Input value={draft.name} onChange={(e) => set({ name: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Brand">
                  <Select value={draft.brand} onValueChange={(v) => set({ brand: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => <SelectItem key={b.id} value={b.name}>{b.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Category">
                  <Select value={draft.category} onValueChange={(v) => set({ category: v as AdminProduct["category"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
              <Field label="Model"><Input value={draft.model || ""} onChange={(e) => set({ model: e.target.value })} /></Field>
              <Field label="Tagline / short description"><Input value={draft.tagline} onChange={(e) => set({ tagline: e.target.value })} /></Field>
              <Field label="Description"><Textarea rows={4} value={draft.description || ""} onChange={(e) => set({ description: e.target.value })} /></Field>
            </Section>

            <Section title="Specifications">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Processor"><Input value={draft.processor} onChange={(e) => set({ processor: e.target.value })} /></Field>
                <Field label="Graphics"><Input value={draft.gpu} onChange={(e) => set({ gpu: e.target.value })} /></Field>
                <Field label="RAM"><Input value={draft.ram} onChange={(e) => set({ ram: e.target.value })} /></Field>
                <Field label="Storage"><Input value={draft.storage} onChange={(e) => set({ storage: e.target.value })} /></Field>
                <Field label="Display size"><Input value={draft.displaySize || ""} onChange={(e) => set({ displaySize: e.target.value })} /></Field>
                <Field label="Resolution"><Input value={draft.resolution || ""} onChange={(e) => set({ resolution: e.target.value })} /></Field>
                <Field label="Battery health (%)"><Input type="number" value={draft.batteryHealth ?? ""} onChange={(e) => set({ batteryHealth: Number(e.target.value) })} /></Field>
                <Field label="Windows"><Input value={draft.windows || ""} onChange={(e) => set({ windows: e.target.value })} /></Field>
              </div>
              <div className="flex flex-wrap gap-4 pt-1">
                <Toggle label="Office installed" checked={!!draft.office} onChange={(v) => set({ office: v })} />
                <Toggle label="Charger included" checked={!!draft.charger} onChange={(v) => set({ charger: v })} />
              </div>
            </Section>

            <Section title="Condition & pricing">
              <div className="grid grid-cols-2 gap-3">
                <Field label="Condition">
                  <Select value={draft.condition} onValueChange={(v) => set({ condition: v as AdminProduct["condition"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Grade A+", "Grade A", "Grade B"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Availability">
                  <Select value={draft.availability} onValueChange={(v) => set({ availability: v as AdminProduct["availability"] })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["In stock", "Low stock", "Out of stock"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Price (₹)"><Input type="number" value={draft.price} onChange={(e) => set({ price: Number(e.target.value) })} /></Field>
                <Field label="Original price (₹)"><Input type="number" value={draft.original} onChange={(e) => set({ original: Number(e.target.value) })} /></Field>
              </div>
            </Section>

            <Section title="Media">
              <Field label="Primary image URL"><Input value={draft.image} onChange={(e) => set({ image: e.target.value })} placeholder="/src/assets/…" /></Field>
              <Field label="Additional images (comma-separated)"><Input value={(draft.images || []).join(", ")} onChange={(e) => set({ images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })} /></Field>
              <Field label="Video URL (optional)"><Input value={draft.video || ""} onChange={(e) => set({ video: e.target.value })} /></Field>
            </Section>

            <Section title="SEO">
              <Field label="URL slug"><Input value={draft.slug || ""} onChange={(e) => set({ slug: e.target.value })} /></Field>
              <Field label="Meta title"><Input value={draft.metaTitle || ""} onChange={(e) => set({ metaTitle: e.target.value })} /></Field>
              <Field label="Meta description"><Textarea rows={2} value={draft.metaDescription || ""} onChange={(e) => set({ metaDescription: e.target.value })} /></Field>
              <Field label="Keywords"><Input value={draft.keywords || ""} onChange={(e) => set({ keywords: e.target.value })} placeholder="refurbished, thinkpad, business laptop" /></Field>
            </Section>

            <Section title="Visibility">
              <div className="flex flex-wrap gap-4">
                <Toggle label="Featured product" checked={!!draft.featured} onChange={(v) => set({ featured: v })} />
                <Toggle label="New arrival" checked={!!draft.newArrival} onChange={(v) => set({ newArrival: v })} />
                <Toggle label="Active" checked={!!draft.active} onChange={(v) => set({ active: v })} />
              </div>
            </Section>
          </div>
        )}

        <SheetFooter className="mt-6 flex-row gap-2 sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => draft && onSave(draft)}>Save product</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-3">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <Checkbox checked={checked} onCheckedChange={(v) => onChange(!!v)} />
      {label}
    </label>
  );
}