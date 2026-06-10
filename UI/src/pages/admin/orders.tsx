import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/layouts/admin-layout";
import DataTableToolbar from "@/components/data-table-toolbar";
import StatusBadge from "@/components/status-badge";
import OrderTimeline from "@/components/order-timeline";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { adminFetch, exportOrdersCsv } from "@/lib/admin-fetch";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import type { OrderStatus } from "@/lib/api-adapters/types";

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: orders = [] } = useQuery<any[]>({
    queryKey: ["admin-orders"],
    queryFn: () => adminFetch("/api/orders", token),
    enabled: !!token,
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      adminFetch(`/api/orders/${id}/status`, token, {
        method: "PUT",
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
      toast({ title: "Status updated" });
    },
  });

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch =
      o.shippingAddress.name.toLowerCase().includes(q) ||
      o.shippingAddress.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold">Manage Orders</h1>
        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => exportOrdersCsv(filtered)}
        >
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="mt-6">
        <DataTableToolbar search={search} onSearchChange={setSearch}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            <option value="All">All statuses</option>
            {(["Pending", "Processing", "Shipped", "Completed", "Cancelled"] as OrderStatus[]).map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </DataTableToolbar>

        <div className="space-y-4">
          {filtered.map((ord) => (
            <div
              key={ord._id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-muted-foreground">
                    #{ord._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="font-bold">{ord.shippingAddress.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {ord.shippingAddress.email}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary">
                    ₹{ord.totalAmount.toLocaleString("en-IN")}
                  </p>
                </div>
                <StatusBadge status={ord.status} />
              </div>
              <div className="mt-4">
                <OrderTimeline status={ord.status} />
              </div>
              <ul className="mt-4 text-sm text-muted-foreground">
                {ord.items.map((item: any, i: number) => (
                  <li key={i}>
                    {item.product?.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium">Update status:</span>
                <select
                  value={ord.status}
                  onChange={(e) =>
                    updateStatus.mutate({ id: ord._id, status: e.target.value })
                  }
                  className="rounded-xl border border-border px-3 py-2 text-sm"
                >
                  {(["Pending", "Processing", "Shipped", "Completed", "Cancelled"] as OrderStatus[]).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
