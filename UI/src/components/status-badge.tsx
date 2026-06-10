import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/api-adapters/types";

const styles: Record<OrderStatus, string> = {
  Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  Processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  Shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-200",
  Completed: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

export default function StatusBadge({
  status,
  className,
}: {
  status: OrderStatus | string;
  className?: string;
}) {
  const key = status as OrderStatus;
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-bold",
        styles[key] ?? "bg-muted text-muted-foreground",
        className
      )}
    >
      {status}
    </span>
  );
}
