import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
import FileDropzone from "@/components/file-dropzone";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { slugify } from "@/lib/api-adapters/types";
import { useAuth } from "@/hooks/use-auth";
import { adminFetch } from "@/lib/admin-fetch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Upload, Edit } from "lucide-react";

export default function AdminSubcategoriesPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: items = [] } = useQuery<any[]>({
    queryKey: ["/api/subcategories"],
    queryFn: () => adminFetch("/api/subcategories", token)
  });

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    queryFn: () => adminFetch("/api/categories", token)
  });

  const [form, setForm] = useState({
    _id: "", categoryId: "", categoryName: "", newCategoryName: "", name: "", weightLabel: "500g", price: "", imageUrl: "",
  });

  const addMutation = useMutation({
    mutationFn: async (data: any) =>
      adminFetch("/api/subcategories", token, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (newItem) => {
      queryClient.setQueryData(["/api/subcategories"], (old: any[] = []) => [...old, newItem]);
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
      setOpen(false);
      toast({ title: "Subcategory saved" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      adminFetch(`/api/subcategories/${id}`, token, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
      setDeleteId(null);
      toast({ title: "Deleted" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) =>
      adminFetch(`/api/subcategories/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(["/api/subcategories"], (old: any[] = []) =>
        old.map((item) => (item._id === updatedItem._id ? updatedItem : item))
      );
      queryClient.invalidateQueries({ queryKey: ["/api/subcategories"] });
      setOpen(false);
      toast({ title: "Subcategory updated" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  });

  const filtered = items.filter(
    (s) =>
      (s.name?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (s.categoryName?.toLowerCase() || "").includes(search.toLowerCase())
  );

  const save = async () => {
    if (!form.name || !form.price || !form.imageUrl) {
      toast({
        title: "Validation Error",
        description: "Name, Price, and Image are required.",
        variant: "destructive",
      });
      return;
    }

    let finalCategoryId = form.categoryId;
    let finalCategoryName = form.categoryName;

    if (form.categoryId === "new") {
      if (!form.newCategoryName) {
        toast({
          title: "Validation Error",
          description: "New Category Name is required.",
          variant: "destructive",
        });
        return;
      }
      try {
        const res = await adminFetch("/api/categories", token, {
          method: "POST",
          body: JSON.stringify({
            name: form.newCategoryName,
            description: "Added from subcategories",
          }),
        });
        finalCategoryId = res._id;
        finalCategoryName = res.name;
        queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      } catch (err: any) {
        toast({
          title: "Failed to create category",
          description: err.message,
          variant: "destructive",
        });
        return;
      }
    } else if (!form.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a parent category.",
        variant: "destructive",
      });
      return;
    } else {
      // Refresh category name just in case local state is out of sync
      const cat = categories.find((c: any) => c._id === form.categoryId);
      if (cat) finalCategoryName = cat.name;
    }

    if (!finalCategoryName) {
      toast({
        title: "Error",
        description: "Could not determine category name.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      categoryId: finalCategoryId,
      categoryName: finalCategoryName,
      categorySlug: slugify(finalCategoryName),
      name: form.name,
      weightLabel: form.weightLabel,
      price: Number(form.price),
      imageUrl: form.imageUrl,
    };

    if (form._id) {
       updateMutation.mutate({ id: form._id, data: payload });
    } else {
       addMutation.mutate(payload);
    }
  };

  const publishAsProduct = async (row: any) => {
    try {
      const res = await adminFetch("/api/products", token, {
        method: "POST",
        body: JSON.stringify({
          name: `${row.name} (${row.weightLabel})`,
          description: `Weight: ${row.weightLabel}. ${row.categoryName} collection.`,
          price: row.price,
          image: row.imageUrl,
          category: row.categoryId.startsWith("cat-") ? categories[0]?._id : row.categoryId,
          isFeatured: false,
          inStock: true,
        }),
      });
      // we do not need to show notification here if it updates the ID silently
      updateMutation.mutate({ id: row._id, data: { productId: res._id } });
      toast({ title: "Published to products API" });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const openAdd = () => {
    setForm({ _id: "", categoryId: "", categoryName: "", newCategoryName: "", name: "", weightLabel: "500g", price: "", imageUrl: "" });
    setOpen(true);
  };

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Manage Subcategories</h1>
        <Button onClick={openAdd} className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add Subcategory</Button>
      </div>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch} />
        <div className="overflow-x-auto rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Category</th>
                <th className="p-4">Name</th>
                <th className="p-4">Weight</th>
                <th className="p-4">Price</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row) => (
                <tr key={row._id}>
                  <td className="p-4">{row.categoryName}</td>
                  <td className="p-4 font-medium">{row.name}</td>
                  <td className="p-4">{row.weightLabel}</td>
                  <td className="p-4">₹{row.price}</td>
                  <td className="p-4 text-right space-x-2 whitespace-nowrap">
                    <Button size="sm" variant="ghost" onClick={() => {
                        setForm({
                            _id: row._id,
                            categoryId: row.categoryId,
                            categoryName: row.categoryName,
                            newCategoryName: "",
                            name: row.name,
                            weightLabel: row.weightLabel,
                            price: String(row.price),
                            imageUrl: row.imageUrl,
                        });
                        setOpen(true);
                    }}>
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => publishAsProduct(row)}><Upload className="mr-1 h-3 w-3" /> Sync</Button>
                    <Button size="sm" variant="ghost" onClick={() => setDeleteId(row._id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{form._id ? "Edit Subcategory" : "Add Subcategory"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Parent category</Label>
              <select
                className="mt-2 w-full rounded-xl border border-border p-3 text-sm"
                value={form.categoryId}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === "new") {
                    setForm({ ...form, categoryId: val, categoryName: "" });
                  } else {
                    const c = categories.find((x: any) => x._id === val);
                    setForm({ ...form, categoryId: val, categoryName: c?.name || "" });
                  }
                }}
              >
                <option value="">Select...</option>
                <option value="new">+ Add New Category</option>
                {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            {form.categoryId === "new" && (
                <div>
                  <Label>New Category Name</Label>
                  <Input value={form.newCategoryName} onChange={(e) => setForm({ ...form, newCategoryName: e.target.value })} className="mt-2 rounded-xl" />
                </div>
            )}
            <div>
              <Label>Subcategory name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-2 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Weight</Label><Input value={form.weightLabel} onChange={(e) => setForm({ ...form, weightLabel: e.target.value })} className="mt-2 rounded-xl" /></div>
              <div><Label>Price (₹)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-2 rounded-xl" /></div>
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                placeholder="Paste external image URL here"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="mt-2 rounded-xl"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or upload file</span>
              </div>
            </div>
            <FileDropzone value={form.imageUrl} onChange={(url) => setForm({ ...form, imageUrl: url })} />
            <Button onClick={save} className="w-full rounded-xl" disabled={addMutation.isPending || updateMutation.isPending}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
      <ConfirmDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)} title="Delete subcategory?" destructive confirmLabel="Delete" onConfirm={() => deleteMutation.mutate(deleteId!)} />
    </AdminLayout>
  );
}

