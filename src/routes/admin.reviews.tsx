import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/admin/AdminShell";
import { useAdmin, admin } from "@/lib/admin-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, EyeOff, Eye, Trash2, Sparkles } from "lucide-react";
import { adminToast } from "@/lib/admin-toast";

export const Route = createFileRoute("/admin/reviews")({ component: ReviewsPage });

function ReviewsPage() {
  const reviews = useAdmin((s) => s.reviews);
  return (
    <>
      <PageHeader title="Reviews" description={`${reviews.length} customer testimonials`} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-xl border bg-card p-4">
            <div className="flex items-center justify-between">
              <div className="font-medium text-sm">{r.customer}</div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-amber-500 text-amber-500" : "text-muted"}`} />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.text}</p>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex gap-1.5">
                <Badge variant={r.status === "Approved" ? "secondary" : r.status === "Hidden" ? "outline" : "destructive"}>{r.status}</Badge>
                {r.featured && <Badge>★ Homepage</Badge>}
              </div>
              <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleDateString()}</div>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {r.status !== "Approved" && <Button size="sm" variant="outline" onClick={async () => { const ok = await admin.saveReview({ ...r, status: "Approved" }); if (ok) { adminToast.success("Review approved", { description: "The review is now visible." }); } else { adminToast.error("Review could not be approved", { description: "Please try again." }); } }}><Eye className="size-3.5" /> Approve</Button>}
              {r.status !== "Hidden" && <Button size="sm" variant="outline" onClick={() => admin.saveReview({ ...r, status: "Hidden" })}><EyeOff className="size-3.5" /> Hide</Button>}
              <Button size="sm" variant="outline" onClick={async () => { const ok = await admin.saveReview({ ...r, featured: !r.featured }); if (ok) { adminToast.info(r.featured ? "Review unfeatured" : "Review featured", { description: r.featured ? "The review is no longer highlighted." : "The review is now highlighted." }); } else { adminToast.error("Review visibility could not be updated", { description: "Please try again." }); } }}><Sparkles className="size-3.5" /> {r.featured ? "Unfeature" : "Feature"}</Button>
              <Button size="sm" variant="ghost" className="text-destructive" onClick={async () => { const ok = await admin.deleteReview(r.id); if (ok) { adminToast.success("Review deleted", { description: "The review was removed." }); } else { adminToast.error("Review could not be deleted", { description: "Please try again." }); } }}><Trash2 className="size-3.5" /></Button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}