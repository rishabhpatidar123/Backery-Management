import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import FileDropzone from "@/components/file-dropzone";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "@/lib/admin-fetch";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function AdminAdsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [preview, setPreview] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", flashLine: "", description: "", link: "/products", imageUrl: "", placement: "home-banner" as const,
  });

  const { data: ads = [] } = useQuery<any[]>({
    queryKey: ["/api/ads"],
    queryFn: () => adminFetch("/api/ads", token)
  });

  const addMutation = useMutation({
    mutationFn: async (data: typeof form) => adminFetch("/api/ads", token, { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ads"] });
      setForm({ title: "", flashLine: "", description: "", link: "/products", imageUrl: "", placement: "home-banner" });
      toast({ title: "Ad created" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminFetch(`/api/ads/${id}`, token, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/ads"] }); setDeleteId(null); toast({ title: "Ad deleted" }); }
  });

  const reorderMutation = useMutation({
    mutationFn: async (ids: string[]) => adminFetch("/api/ads/reorder", token, { method: "PUT", body: JSON.stringify({ ids }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/ads"] })
  });

  const move = (index: number, dir: -1 | 1) => {
    const ids = ads.map((a: any) => a._id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    reorderMutation.mutate(ids);
  };

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold">Manage Ads</h1>

      <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="font-semibold">Add new ad</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-2 rounded-xl" />
          </div>
          <div>
            <Label>Flash line</Label>
            <Input value={form.flashLine} onChange={(e) => setForm({ ...form, flashLine: e.target.value })} className="mt-2 rounded-xl" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 rounded-xl" />
          </div>
          <div>
            <Label>Link</Label>
            <Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className="mt-2 rounded-xl" />
          </div>
          <div className="md:col-span-2">
            <FileDropzone value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
          </div>
        </div>
        <Button onClick={() => addMutation.mutate(form)} className="mt-4 rounded-xl" disabled={addMutation.isPending}>
          <Plus className="mr-2 h-4 w-4" /> Add Ad
        </Button>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {ads.map((ad, i) => (
          <div key={ad._id} className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <img src={ad.imageUrl} alt="" className="h-40 w-full object-cover" loading="lazy" />
            <div className="p-5">
              <p className="text-xs font-bold text-primary">{ad.flashLine}</p>
              <h3 className="font-serif text-lg font-bold">{ad.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{ad.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => setPreview(ad)}>Preview</Button>
                <Button size="sm" variant="ghost" onClick={() => move(i, -1)}><GripVertical className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => setDeleteId(ad._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>{preview?.title}</DialogTitle></DialogHeader>
          {preview && (
            <>
              <img src={preview.imageUrl} alt="" className="rounded-xl" />
              <p className="font-bold text-primary">{preview.flashLine}</p>
              <p>{preview.description}</p>
            </>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete ad?" destructive confirmLabel="Delete" onConfirm={() => deleteMutation.mutate(deleteId!)} />
    </AdminLayout>
  );
}
