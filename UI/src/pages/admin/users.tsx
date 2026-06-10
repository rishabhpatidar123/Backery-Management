import { useState } from "react";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
import ConfirmDialog from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/admin-fetch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, List, Ban, Trash2 } from "lucide-react";
import StatusBadge from "@/components/status-badge";

export default function AdminUsersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: users = [] } = useQuery<any[]>({
    queryKey: ["/api/users"],
    queryFn: () => adminFetch("/api/users", token)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => 
      adminFetch(`/api/users/${id}/status`, token, { method: "PUT", body: JSON.stringify({ status }) }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/users"] }); toast({ title: "Status updated" }); }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => adminFetch(`/api/users/${id}`, token, { method: "DELETE" }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["/api/users"] }); setDeleteId(null); toast({ title: "User deleted" }); }
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Manage Users</h1>
        <div className="flex gap-2">
          <Button variant={view === "cards" ? "default" : "outline"} size="icon" onClick={() => setView("cards")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === "table" ? "default" : "outline"} size="icon" onClick={() => setView("table")}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch} />

        {view === "cards" ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((u) => (
              <div key={u._id} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <p className="text-xs text-muted-foreground">{u.regId}</p>
                <h3 className="mt-1 font-serif text-xl font-bold">{u.name}</h3>
                <p className="text-sm text-muted-foreground">{u.email}</p>
                <p className="mt-2 text-sm">{u.mobile}</p>
                <div className="mt-3">
                  <StatusBadge status={u.status === "blocked" ? "Cancelled" : "Completed"} />
                  <span className="ml-2 text-xs capitalize">{u.status}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => updateMutation.mutate({ id: u._id, status: u.status === "blocked" ? "active" : "blocked" })}>
                    <Ban className="mr-1 h-3 w-3" />
                    {u.status === "blocked" ? "Unblock" : "Block"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleteId(u._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((u) => (
                  <tr key={u._id}>
                    <td className="p-4 font-mono text-xs">{u.regId}</td>
                    <td className="p-4">{u.name}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4 capitalize">{u.status}</td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="outline" onClick={() => setDeleteId(u._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete user?"
        destructive
        confirmLabel="Delete"
        onConfirm={() => deleteMutation.mutate(deleteId!)}
      />
    </AdminLayout>
  );
}
