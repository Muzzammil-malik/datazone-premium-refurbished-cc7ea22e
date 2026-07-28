import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, newId, type AdminProduct, type ProductVariant, type VariantOption, type VariantGroup } from "@/lib/admin-store";
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
import { adminToast } from "@/lib/admin-toast";

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

  const bulkDelete = async () => {
    if (!selected.length) return;
    const ok = (await Promise.all(selected.map((id) => admin.deleteProduct(id)))).every(Boolean);
    setSelected([]);
    if (ok) {
      adminToast.success(`Deleted ${selected.length} products`, { description: "The selected products were removed." });
    } else {
      adminToast.error("Some products could not be deleted", { description: "Please try again." });
    }
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
                        <DropdownMenuItem onClick={async () => { const ok = await admin.duplicateProduct(p.id); if (ok) { adminToast.info("Product duplicated", { description: "A copy has been created for editing." }); } else { adminToast.error("Product could not be duplicated", { description: "Please try again." }); } }}><Copy className="size-3.5" /> Duplicate</DropdownMenuItem>
                        <DropdownMenuItem onClick={async () => { const ok = await admin.saveProduct({ ...p, active: !p.active }); if (ok) { adminToast.success(p.active ? "Product archived" : "Product restored", { description: p.active ? "The product is now hidden from the catalog." : "The product is active again." }); } else { adminToast.error("Product status could not be updated", { description: "Please try again." }); } }}><Archive className="size-3.5" /> {p.active ? "Archive" : "Restore"}</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={async () => { const ok = await admin.deleteProduct(p.id); if (ok) { adminToast.success("Product deleted", { description: "The product was removed." }); } else { adminToast.error("Product could not be deleted", { description: "Please try again." }); } }}>
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
        onSave={async (p) => { const ok = await admin.saveProduct(p); if (ok) { adminToast.success(p.id ? "Product updated" : "Product added", { description: p.name || "The product is live." }); } else { adminToast.error("Product could not be saved", { description: "Please try again." }); } setEditing(null); }}
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
              {draft.category === "Monitors" ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Display size"><Input value={draft.displaySize || ""} onChange={(e) => set({ displaySize: e.target.value })} /></Field>
                    <Field label="Resolution"><Input value={draft.resolution || ""} onChange={(e) => set({ resolution: e.target.value })} /></Field>
                  </div>
                  <Field label="Ports"><Input value={draft.ports || ""} onChange={(e) => set({ ports: e.target.value })} placeholder="HDMI, DisplayPort, USB-C, etc." /></Field>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Processor"><Input value={draft.processor} onChange={(e) => set({ processor: e.target.value })} /></Field>
                    <Field label="Graphics"><Input value={draft.gpu} onChange={(e) => set({ gpu: e.target.value })} /></Field>
                    <Field label="RAM"><Input value={draft.ram} onChange={(e) => set({ ram: e.target.value })} /></Field>
                    <Field label="Storage"><Input value={draft.storage} onChange={(e) => set({ storage: e.target.value })} /></Field>
                    <Field label="Cores / Threads"><Input value={draft.coresThreads || ""} onChange={(e) => set({ coresThreads: e.target.value })} placeholder="4 Cores / 8 Threads" /></Field>
                    <Field label="Clock Speed"><Input value={draft.clockSpeed || ""} onChange={(e) => set({ clockSpeed: e.target.value })} placeholder="3.6 GHz Base, 4.2 GHz Turbo" /></Field>
                    <Field label="Display size"><Input value={draft.displaySize || ""} onChange={(e) => set({ displaySize: e.target.value })} /></Field>
                    <Field label="Resolution"><Input value={draft.resolution || ""} onChange={(e) => set({ resolution: e.target.value })} /></Field>
                    <Field label="Battery health (%)"><Input type="number" value={draft.batteryHealth ?? ""} onChange={(e) => set({ batteryHealth: Number(e.target.value) })} /></Field>
                    <Field label="Operating System"><Input value={draft.operatingSystem || ""} onChange={(e) => set({ operatingSystem: e.target.value })} /></Field>
                  </div>
                  <div className="flex flex-wrap gap-4 pt-1">
                    <Toggle label="Office installed" checked={!!draft.office} onChange={(v) => set({ office: v })} />
                    <Toggle label="Charger included" checked={!!draft.charger} onChange={(v) => set({ charger: v })} />
                  </div>
                </>
              )}
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
                <Field label="Base Price (₹)">
                  <Input type="number" value={draft.basePrice ?? draft.price} onChange={(e) => set({ basePrice: Number(e.target.value), price: Number(e.target.value) })} />
                  <p className="text-xs text-muted-foreground mt-1">Base price before variant adjustments</p>
                </Field>
                <Field label="Original price (₹)"><Input type="number" value={draft.original} onChange={(e) => set({ original: Number(e.target.value) })} /></Field>
              </div>
            </Section>

            <Section title="Variant Groups">
              <div className="text-xs text-muted-foreground mb-3">
                Create variant groups (e.g., RAM, Storage) with multiple options. Each option has a price adjustment.
              </div>
              <div className="space-y-6">
                {(draft.variantGroups || []).map((group, groupIndex) => (
                  <div key={group.id} className="rounded-lg border bg-card p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium">{group.name || `Group ${groupIndex + 1}`}</span>
                        <Input
                          className="h-7 w-40 text-xs"
                          value={group.name}
                          onChange={(e) => {
                            const next = [...(draft.variantGroups || [])];
                            next[groupIndex] = { ...next[groupIndex], name: e.target.value };
                            set({ variantGroups: next });
                          }}
                          placeholder="Group name (e.g., RAM)"
                        />
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          const next = (draft.variantGroups || []).filter((_, i) => i !== groupIndex);
                          set({ variantGroups: next });
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {(group.options || []).map((option, optionIndex) => (
                        <div key={option.id} className="rounded-md border bg-background p-3 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">Option {optionIndex + 1}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-destructive"
                              onClick={() => {
                                const next = [...(draft.variantGroups || [])];
                                next[groupIndex] = { ...next[groupIndex], options: next[groupIndex].options?.filter((_, i) => i !== optionIndex) || [] };
                                set({ variantGroups: next });
                              }}
                            >
                              <Trash2 className="size-3" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Value">
                              <Input
                                className="h-8 text-sm"
                                value={option.value}
                                onChange={(e) => {
                                  const next = [...(draft.variantGroups || [])];
                                  next[groupIndex] = { 
                                    ...next[groupIndex], 
                                    options: next[groupIndex].options?.map((o, i) => i === optionIndex ? { ...o, value: e.target.value } : o) || []
                                  };
                                  set({ variantGroups: next });
                                }}
                                placeholder="8GB, 16GB, etc."
                              />
                            </Field>
                            <Field label="Price Adjustment (₹)">
                              <Input
                                type="number"
                                className="h-8 text-sm"
                                value={option.priceAdjustment}
                                onChange={(e) => {
                                  const next = [...(draft.variantGroups || [])];
                                  next[groupIndex] = { 
                                    ...next[groupIndex], 
                                    options: next[groupIndex].options?.map((o, i) => i === optionIndex ? { ...o, priceAdjustment: Number(e.target.value) } : o) || []
                                  };
                                  set({ variantGroups: next });
                                }}
                                placeholder="0"
                              />
                            </Field>
                            <Field label="Stock">
                              <Input
                                type="number"
                                className="h-8 text-sm"
                                value={option.stock}
                                onChange={(e) => {
                                  const next = [...(draft.variantGroups || [])];
                                  next[groupIndex] = { 
                                    ...next[groupIndex], 
                                    options: next[groupIndex].options?.map((o, i) => i === optionIndex ? { ...o, stock: Number(e.target.value) } : o) || []
                                  };
                                  set({ variantGroups: next });
                                }}
                              />
                            </Field>
                            <Field label="Availability">
                              <Select
                                value={option.availability}
                                onValueChange={(v) => {
                                  const next = [...(draft.variantGroups || [])];
                                  next[groupIndex] = { 
                                    ...next[groupIndex], 
                                    options: next[groupIndex].options?.map((o, i) => i === optionIndex ? { ...o, availability: v as VariantOption["availability"] } : o) || []
                                  };
                                  set({ variantGroups: next });
                                }}
                              >
                                <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  {["In stock", "Low stock", "Out of stock"].map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </Field>
                          </div>
                        </div>
                      ))}
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const next = [...(draft.variantGroups || [])];
                          const newOption: VariantOption = {
                            id: `dz-${newId()}`,
                            variantGroupId: group.id,
                            value: "",
                            priceAdjustment: 0,
                            stock: 1,
                            availability: "In stock",
                            order: (group.options || []).length,
                          };
                          next[groupIndex] = { ...next[groupIndex], options: [...(next[groupIndex].options || []), newOption] };
                          set({ variantGroups: next });
                        }}
                      >
                        <Plus className="size-3 mr-1" /> Add Option
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const newGroup: VariantGroup = {
                      id: `dz-${newId()}`,
                      productId: draft.id,
                      name: "",
                      order: (draft.variantGroups || []).length,
                      options: [],
                    };
                    set({ variantGroups: [...(draft.variantGroups || []), newGroup] });
                  }}
                >
                  <Plus className="size-4 mr-2" /> Add Variant Group
                </Button>
              </div>
            </Section>

            <Section title="Legacy Variants (Deprecated)">
              <div className="text-xs text-muted-foreground mb-3">
                Legacy variant system. Use Variant Groups above for new products.
              </div>
              <div className="space-y-4">
                {(draft.variants || []).map((variant, index) => (
                  <div key={variant.id} className="rounded-lg border bg-card p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Variant {index + 1}</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => {
                          const next = (draft.variants || []).filter((_, i) => i !== index);
                          set({ variants: next });
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Type (e.g., RAM, Storage)">
                        <Input
                          value={variant.type}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], type: e.target.value };
                            set({ variants: next });
                          }}
                          placeholder="RAM"
                        />
                      </Field>
                      <Field label="Value (e.g., 8GB, 16GB)">
                        <Input
                          value={variant.value}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], value: e.target.value };
                            set({ variants: next });
                          }}
                          placeholder="8GB"
                        />
                      </Field>
                      <Field label="Price (₹)">
                        <Input
                          type="number"
                          value={variant.price}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], price: Number(e.target.value) };
                            set({ variants: next });
                          }}
                        />
                      </Field>
                      <Field label="Original price (₹)">
                        <Input
                          type="number"
                          value={variant.originalPrice ?? ""}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], originalPrice: Number(e.target.value) || undefined };
                            set({ variants: next });
                          }}
                        />
                      </Field>
                      <Field label="Stock quantity">
                        <Input
                          type="number"
                          value={variant.stock}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], stock: Number(e.target.value) };
                            set({ variants: next });
                          }}
                        />
                      </Field>
                      <Field label="Availability">
                        <Select
                          value={variant.availability}
                          onValueChange={(v) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], availability: v as ProductVariant["availability"] };
                            set({ variants: next });
                          }}
                        >
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {["In stock", "Low stock", "Out of stock"].map((s) => (
                              <SelectItem key={s} value={s}>{s}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field label="SKU (optional)">
                        <Input
                          value={variant.sku ?? ""}
                          onChange={(e) => {
                            const next = [...(draft.variants || [])];
                            next[index] = { ...next[index], sku: e.target.value || undefined };
                            set({ variants: next });
                          }}
                          placeholder="SKU-001"
                        />
                      </Field>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const next: ProductVariant[] = [...(draft.variants || []), {
                      id: `dz-${newId()}`,
                      productId: draft.id,
                      type: "",
                      value: "",
                      price: draft.price,
                      originalPrice: draft.original || undefined,
                      stock: 1,
                      availability: "In stock",
                      sku: undefined,
                      order: (draft.variants || []).length,
                    }];
                    set({ variants: next });
                  }}
                >
                  <Plus className="size-4 mr-2" /> Add variant
                </Button>
              </div>
            </Section>

            <Section title="Media">
              <Field label="Product image gallery">
                <div className="space-y-3 rounded-xl border bg-background p-3">
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" size="sm" variant="outline" onClick={() => {
                      const value = window.prompt("Enter image URL");
                      if (!value) return;
                      const next = [...(draft.images ?? []), value.trim()].filter(Boolean);
                      set({ images: next, image: next[0] || draft.image });
                    }}>
                      + Add image
                    </Button>
                    {draft.images?.length ? (
                      <Button type="button" size="sm" variant="outline" onClick={() => {
                        const next = [...(draft.images ?? [])];
                        const first = next.shift();
                        set({ images: next, image: next[0] || first || "" });
                      }}>
                        Remove first
                      </Button>
                    ) : null}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {(draft.images || []).map((src, index) => (
                      <div key={`${src}-${index}`} className="rounded-lg border bg-card p-2">
                        <div className="flex items-center gap-2 mb-2">
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-muted"
                            onClick={() => {
                              const next = [...(draft.images ?? [])];
                              const [item] = next.splice(index, 1);
                              next.splice(Math.max(index - 1, 0), 0, item);
                              set({ images: next, image: next[0] || draft.image });
                            }}
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="text-xs px-2 py-1 rounded bg-muted"
                            onClick={() => {
                              const next = [...(draft.images ?? [])];
                              const [item] = next.splice(index, 1);
                              next.splice(Math.min(index + 1, next.length), 0, item);
                              set({ images: next, image: next[0] || draft.image });
                            }}
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="ml-auto text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground"
                            onClick={() => {
                              const next = (draft.images || []).filter((_, i) => i !== index);
                              set({ images: next, image: next[0] || "" });
                            }}
                          >
                            Remove
                          </button>
                        </div>
                        <img src={src} alt="" className="h-24 w-full rounded object-cover border" />
                        <Input
                          value={src}
                          onChange={(e) => {
                            const next = [...(draft.images || [])];
                            next[index] = e.target.value;
                            set({ images: next, image: next[0] || draft.image });
                          }}
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Field>
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
                <div className="flex-1 min-w-[200px]">
                  <Field label="Visibility">
                    <Select
                      value={draft.visibility ?? "active"}
                      onValueChange={(v) => set({ visibility: v as "active" | "hidden" | "unavailable" })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="hidden">Hidden</SelectItem>
                        <SelectItem value="unavailable">Currently Unavailable</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
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