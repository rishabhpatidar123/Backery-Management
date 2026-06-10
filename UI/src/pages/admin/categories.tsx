import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
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
import ConfirmDialog from "@/components/confirm-dialog";

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"],
    queryFn: () => adminFetch("/api/categories", token),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) =>
      adminFetch("/api/categories", token, {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setOpen(false);
      resetForm();
      toast({ title: "Category created" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      adminFetch(`/api/categories/${id}`, token, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setOpen(false);
      resetForm();
      toast({ title: "Category updated" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      adminFetch(`/api/categories/${id}`, token, {
        method: "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      setDeleteId(null);
      toast({ title: "Category deleted" });
    },
    onError: (e: Error) =>
      toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const resetForm = () => {
    setName("");
    setDescription("");
    setEditingId(null);
  };

  const handleEdit = (cat: any) => {
    setEditingId(cat._id);
    setName(cat.name);
    setDescription(cat.description || "");
    setOpen(true);
  };

  const handleSave = () => {
    const payload = { name, description };
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Manage Categories</h1>
        <Button onClick={() => { resetForm(); setOpen(true); }} className="rounded-xl">
          <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </div>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch} />
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Description</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cat) => (
                <tr key={cat._id} className="hover:bg-muted/30">
                  <td className="p-4 font-medium">{cat.name}</td>
                  <td className="p-4 text-muted-foreground">
                    {cat.description || "—"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(cat)}>
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteId(cat._id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(val) => { if (!val) resetForm(); setOpen(val); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 rounded-xl"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!name || createMutation.isPending || updateMutation.isPending}
              className="w-full rounded-xl"
            >
              {editingId ? "Update" : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <ConfirmDialog 
        open={!!deleteId} 
        onOpenChange={() => setDeleteId(null)} 
        title="Delete category?" 
        description="This will also affect subcategories and products in this category."
        destructive 
        confirmLabel="Delete" 
        onConfirm={() => deleteMutation.mutate(deleteId!)} 
      />
    </AdminLayout>
  );
}

