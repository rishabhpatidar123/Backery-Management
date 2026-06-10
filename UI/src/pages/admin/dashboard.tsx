import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import AdminLayout from "@/layouts/admin-layout";
import StatCard from "@/components/stat-card";
import { DashboardCardsSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { adminFetch } from "@/lib/admin-fetch";
import StatusBadge from "@/components/status-badge";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";

const PIE_COLORS = ["#d97706", "#f59e0b", "#1f2937", "#ffedd5", "#ef4444"];

export default function AdminDashboardPage() {
  const { token } = useAuth();

  const { data: orders = [], isLoading: ordersLoading } = useQuery<any[]>({
    queryKey: ["admin-orders"],
    queryFn: () => adminFetch("/api/orders", token),
    enabled: !!token,
  });

  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const totalSales = orders
    .filter((o) => o.status !== "Cancelled")
    .reduce((s, o) => s + o.totalAmount, 0);

  const customers = useMemo(() => {
    const emails = new Set<string>();
    orders.forEach((o) => emails.add(o.shippingAddress?.email));
    return emails.size;
  }, [orders]);

  const monthlySales = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => {
      if (o.status === "Cancelled") return;
      const key = new Date(o.createdAt).toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      map.set(key, (map.get(key) || 0) + o.totalAmount);
    });
    return Array.from(map.entries()).map(([month, sales]) => ({ month, sales }));
  }, [orders]);

  const statusChart = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) => map.set(o.status, (map.get(o.status) || 0) + 1));
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const topProducts = useMemo(() => {
    const map = new Map<string, number>();
    orders.forEach((o) =>
      o.items.forEach((item: any) => {
        const n = item.product?.name || "Unknown";
        map.set(n, (map.get(n) || 0) + item.quantity);
      })
    );
    return Array.from(map.entries())
      .map(([name, qty]) => ({ name, qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [orders]);

  return (
    <AdminLayout>
      <h1 className="font-serif text-3xl font-bold">Dashboard</h1>
      <p className="mt-1 text-muted-foreground">Overview of your bakery business</p>

      {ordersLoading ? (
        <div className="mt-8">
          <DashboardCardsSkeleton />
        </div>
      ) : (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Total Revenue"
              value={`₹${totalSales.toLocaleString("en-IN")}`}
              icon={DollarSign}
            />
            <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} />
            <StatCard label="Customers" value={customers} icon={Users} />
            <StatCard label="Products" value={products.length} icon={Package} />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">Monthly Sales</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySales}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#d97706" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">Order Status</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChart}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {statusChart.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold">Recent Orders</h3>
                <Link href="/admin/orders">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    View all
                  </Button>
                </Link>
              </div>
              <div className="mt-4 space-y-3">
                {orders.slice(0, 8).map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center justify-between border-b border-border/50 py-2 text-sm"
                  >
                    <span className="font-mono text-xs">
                      #{o._id.slice(-6).toUpperCase()}
                    </span>
                    <StatusBadge status={o.status} />
                    <span className="font-bold">
                      ₹{o.totalAmount.toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">Top Selling Products</h3>
              <ul className="mt-4 space-y-3">
                {topProducts.map((p) => (
                  <li key={p.name} className="flex justify-between text-sm">
                    <span>{p.name}</span>
                    <span className="font-bold text-primary">{p.qty} sold</span>
                  </li>
                ))}
                {topProducts.length === 0 && (
                  <p className="text-muted-foreground">No sales data yet.</p>
                )}
              </ul>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
