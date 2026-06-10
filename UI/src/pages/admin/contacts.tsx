import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
import StatusBadge from "@/components/status-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "@/lib/admin-fetch";

export default function AdminContactsPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<any | null>(null);

  const { data: contacts = [] } = useQuery<any[]>({
    queryKey: ["/api/contacts"],
    queryFn: () => adminFetch("/api/contacts", token)
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => adminFetch(`/api/contacts/${id}/status`, token, { method: "PUT", body: JSON.stringify({ status }) }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      setSelected(data);
      toast({ title: "Status updated" });
    }
  });

  const filtered = contacts.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold">Manage Contacts</h1>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </DataTableToolbar>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((c) => (
                <tr key={c._id} className="hover:bg-muted/30">
                  <td className="p-4 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">{c.name}</td>
                  <td className="p-4">{c.email}</td>
                  <td className="p-4 capitalize">{c.status}</td>
                  <td className="p-4 text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelected(c)}>View</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent>
          <SheetHeader><SheetTitle>{selected?.name}</SheetTitle></SheetHeader>
          {selected && (
            <div className="mt-6 space-y-4 text-sm">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone}</p>
              {selected.service && <p><strong>Service:</strong> {selected.service}</p>}
              <p><strong>Message:</strong> {selected.message}</p>
              <StatusBadge status={selected.status === "new" ? "Pending" : "Completed"} />
              <div className="flex gap-2 pt-4">
                {(["read", "replied"] as const).map((st) => (
                  <Button
                    key={st} size="sm" variant="outline"
                    onClick={() => updateMutation.mutate({ id: selected._id, status: st })}
                  >
                    Mark {st}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
