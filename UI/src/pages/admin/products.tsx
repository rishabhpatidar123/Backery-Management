import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
import FileDropzone from "@/components/file-dropzone";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/use-auth";
import { adminFetch } from "@/lib/admin-fetch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [modal, setModal] = useState<{ open: boolean; mode: "add" | "edit"; data?: any }>({
    open: false,
    mode: "add",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    isFeatured: false,
    inStock: true,
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
  });
  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const openAdd = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      category: categories[0]?._id || "",
      isFeatured: false,
      inStock: true,
    });
    setModal({ open: true, mode: "add" });
  };

  const openEdit = (p: any) => {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      image: p.image,
      category: p.category?._id || "",
      isFeatured: !!p.isFeatured,
      inStock: !!p.inStock,
    });
    setModal({ open: true, mode: "edit", data: p });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const body = { ...form, price: Number(form.price) };
      if (modal.mode === "add") {
        return adminFetch("/api/products", token, {
          method: "POST",
          body: JSON.stringify(body),
        });
      }
      return adminFetch(`/api/products/${modal.data._id}`, token, {
        method: "PUT",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setModal({ open: false, mode: "add" });
      toast({ title: "Product saved" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/products/${id}`, token, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setDeleteId(null);
      toast({ title: "Product deleted" });
    },
  });

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());
    const matchCat =
      catFilter === "All" || p.category?.name === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Manage Products</h1>
        <Button onClick={openAdd} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch}>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="All">All categories</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </DataTableToolbar>

        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td className="p-4">
                    <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" loading="lazy" />
                  </td>
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.category?.name}</td>
                  <td className="p-4">₹{p.price}</td>
                  <td className="p-4">{p.isFeatured ? "Yes" : "No"}</td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(p)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => setDeleteId(p._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={modal.open} onOpenChange={(o) => setModal({ ...modal, open: o })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {modal.mode === "add" ? "Add Product" : "Edit Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 rounded-xl" />
              </div>
              <div>
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 rounded-xl" />
              </div>
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 rounded-xl" />
            </div>
            <div>
              <Label>Category</Label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="mt-2 w-full rounded-xl border border-border p-3 text-sm"
              >
                {categories.map((c: any) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Image</Label>
              <FileDropzone value={form.image} onChange={(url) => setForm({ ...form, image: url })} className="mt-2" />
              <Input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Or paste URL" className="mt-2 rounded-xl" />
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} />
              In stock
            </label>
            <Button onClick={() => saveMutation.mutate()} className="w-full rounded-xl" disabled={saveMutation.isPending}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete product?"
        description="This cannot be undone."
        destructive
        confirmLabel="Delete"
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
      />
    </AdminLayout>
  );
}
