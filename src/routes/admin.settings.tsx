import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin, type Settings } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { adminToast } from "@/lib/admin-toast";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const settings = useAdmin((s) => s.settings);
  const [draft, setDraft] = useState<Settings>(settings);
  const save = async () => { const ok = await admin.saveSettings(draft); if (ok) { adminToast.success("Settings saved", { description: "Your admin settings are updated." }); } else { adminToast.error("Settings could not be saved", { description: "Please try again." }); } };
  return (
    <>
      <PageHeader title="Settings" description="Store, contact, social and SEO configuration."
        actions={<Button size="sm" onClick={save}><Save className="size-4" /> Save changes</Button>} />
      <div className="grid lg:grid-cols-2 gap-4">
        <Panel title="General">
          <F label="Store name"><Input value={draft.storeName} onChange={(e) => setDraft({ ...draft, storeName: e.target.value })} /></F>
          <F label="Logo URL"><Input value={draft.logo || ""} onChange={(e) => setDraft({ ...draft, logo: e.target.value })} /></F>
          <F label="Favicon URL"><Input value={draft.favicon || ""} onChange={(e) => setDraft({ ...draft, favicon: e.target.value })} /></F>
        </Panel>
        <Panel title="Contact">
          <F label="WhatsApp number"><Input value={draft.whatsapp} onChange={(e) => setDraft({ ...draft, whatsapp: e.target.value })} placeholder="919999999999" /></F>
          <F label="Phone"><Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></F>
          <F label="Email"><Input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></F>
          <F label="Store address"><Textarea rows={2} value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></F>
          <F label="Google Maps link"><Input value={draft.mapsLink} onChange={(e) => setDraft({ ...draft, mapsLink: e.target.value })} /></F>
          <F label="Business hours"><Input value={draft.hours} onChange={(e) => setDraft({ ...draft, hours: e.target.value })} /></F>
        </Panel>
        <Panel title="Social media">
          {(["facebook", "instagram", "youtube", "linkedin", "website", "olx"] as const).map((k) => (
            <F key={k} label={k === "olx" ? "OLX" : k[0].toUpperCase() + k.slice(1)}>
              <Input value={draft.social[k]} onChange={(e) => setDraft({ ...draft, social: { ...draft.social, [k]: e.target.value } })} placeholder={k === "olx" ? "https://www.olx.in/profile/..." : ""} />
            </F>
          ))}
        </Panel>
        <Panel title="SEO">
          <F label="Google Analytics ID"><Input value={draft.seo.gaId} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, gaId: e.target.value } })} placeholder="G-XXXXXXX" /></F>
          <F label="Meta title"><Input value={draft.seo.metaTitle} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, metaTitle: e.target.value } })} /></F>
          <F label="Meta description"><Textarea rows={2} value={draft.seo.metaDescription} onChange={(e) => setDraft({ ...draft, seo: { ...draft.seo, metaDescription: e.target.value } })} /></F>
        </Panel>
      </div>
      <div className="mt-6 rounded-xl border border-dashed p-4 flex items-center justify-between">
        <div><div className="text-sm font-medium">Reset admin data</div><p className="text-xs text-muted-foreground">Clears local admin storage and reseeds with demo data.</p></div>
        <Button variant="outline" size="sm" onClick={() => { admin.reset(); adminToast.warning("Admin data reset", { description: "Local admin data has been refreshed." }); setDraft(settings); }}>Reset</Button>
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