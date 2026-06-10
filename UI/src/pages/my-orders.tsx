import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import StatusBadge from "@/components/status-badge";
import EmptyState from "@/components/empty-state";
import { TableSkeleton } from "@/components/loading-skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

export default function MyOrdersPage() {
  const { token } = useAuth();

  const { data: orders = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/orders/my-orders", token],
    queryFn: async () => {
      const res = await fetch("/api/orders/my-orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) {
        throw new Error("Session expired. Please sign in again.");
      }
      if (!res.ok) throw new Error("Failed to load orders");
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <CustomerLayout>
      <PageHero title="My Orders" subtitle="Track your sweet deliveries" />
      <div className="container mx-auto max-w-4xl px-6 py-16">
        {isLoading ? (
          <TableSkeleton />
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Your order history will appear here after checkout."
            actionLabel="Browse Cakes"
            actionHref="/products"
          />
        ) : (
          <div className="space-y-4">
            {orders.map((ord: any) => (
              <Collapsible
                key={ord._id}
                className="rounded-2xl border border-border bg-card shadow-sm"
              >
                <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">
                      #{ord._id.slice(-8).toUpperCase()}
                    </p>
                    <p className="font-serif text-lg font-bold">
                      ₹{ord.totalAmount.toLocaleString("en-IN")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(ord.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={ord.status} />
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="border-t border-border px-6 pb-6 pt-4">
                  <ul className="space-y-2 text-sm">
                    {ord.items.map((item: any, i: number) => (
                      <li key={i} className="flex justify-between">
                        <span>
                          {item.product?.name || "Item"} × {item.quantity}
                        </span>
                        <span>
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-sm text-muted-foreground">
                    {ord.shippingAddress.address}, {ord.shippingAddress.city}
                  </p>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        )}
        <Link href="/products">
          <Button className="mt-8 rounded-full">Order More</Button>
        </Link>
      </div>
    </CustomerLayout>
  );
}
