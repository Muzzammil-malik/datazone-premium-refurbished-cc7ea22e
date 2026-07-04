import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, type Homepage } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/homepage")({ component: HomepageManager });

function HomepageManager() {
  const homepage = useAdmin((s) => s.homepage);
  const products = useAdmin((s) => s.products);
  const reviews = useAdmin((s) => s.reviews);
  const [draft, setDraft] = useState<Homepage>(homepage);
  const save = () => { admin.saveHomepage(draft); toast.success("Homepage updated"); };
  return (
    <>
      <PageHeader title="Homepage Manager" description="Edit hero, featured products, benefits and testimonials — no code required."
        actions={<Button size="sm" onClick={save}><Save className="size-4" /> Save changes</Button>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="Hero banner">
          <F label="Headline"><Input value={draft.heroHeadline} onChange={(e) => setDraft({ ...draft, heroHeadline: e.target.value })} /></F>
          <F label="Subtitle"><Textarea rows={3} value={draft.heroSubtitle} onChange={(e) => setDraft({ ...draft, heroSubtitle: e.target.value })} /></F>
        </Panel>
        <Panel title="Why choose DATAZONe">
          <div className="space-y-3">
            {draft.why.map((w, i) => (
              <div key={i} className="rounded-lg border p-3 space-y-2">
                <Input placeholder="Title" value={w.title} onChange={(e) => setDraft({ ...draft, why: draft.why.map((x, j) => j === i ? { ...x, title: e.target.value } : x) })} />
                <Textarea rows={2} placeholder="Body" value={w.body} onChange={(e) => setDraft({ ...draft, why: draft.why.map((x, j) => j === i ? { ...x, body: e.target.value } : x) })} />
                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => setDraft({ ...draft, why: draft.why.filter((_, j) => j !== i) })}><Trash2 className="size-3.5" /> Remove</Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setDraft({ ...draft, why: [...draft.why, { title: "New benefit", body: "" }] })}><Plus className="size-4" /> Add benefit</Button>
          </div>
        </Panel>
        <Panel title="Featured products">
          <p className="text-xs text-muted-foreground mb-2">Pick products to spotlight on the homepage.</p>
          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {products.map((p) => { const on = draft.featuredIds.includes(p.id); return (
              <label key={p.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted cursor-pointer">
                <Checkbox checked={on} onCheckedChange={(v) => setDraft({ ...draft, featuredIds: v ? [...draft.featuredIds, p.id] : draft.featuredIds.filter((x) => x !== p.id) })} />
                <span className="text-sm truncate">{p.name}</span><span className="ml-auto text-xs text-muted-foreground">{p.brand}</span>
              </label>
            ); })}
          </div>
        </Panel>
        <Panel title="Featured testimonials">
          <div className="max-h-80 overflow-y-auto space-y-1 pr-1">
            {reviews.map((r) => { const on = draft.testimonialIds.includes(r.id); return (
              <label key={r.id} className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted cursor-pointer">
                <Checkbox checked={on} onCheckedChange={(v) => setDraft({ ...draft, testimonialIds: v ? [...draft.testimonialIds, r.id] : draft.testimonialIds.filter((x) => x !== r.id) })} />
                <span className="text-sm truncate">{r.customer}</span><span className="ml-auto text-xs text-muted-foreground truncate max-w-[160px]">{r.text}</span>
              </label>
            ); })}
          </div>
        </Panel>
      </div>
    </>
  );
}
function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="rounded-xl border bg-card p-5"><h3 className="text-sm font-semibold mb-4">{title}</h3><div className="space-y-3">{children}</div></div>;
}
function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}