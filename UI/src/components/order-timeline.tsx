import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/api-adapters/types";

const steps: OrderStatus[] = [
  "Pending",
  "Processing",
  "Shipped",
  "Completed",
];

export default function OrderTimeline({ status }: { status: string }) {
  const cancelled = status === "Cancelled";
  const currentIdx = cancelled ? -1 : steps.indexOf(status as OrderStatus);

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, i) => {
        const done = i <= currentIdx;
        return (
          <div key={step} className="flex flex-1 items-center">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                done
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
              title={step}
            >
              {done ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "mx-1 h-0.5 flex-1",
                  i < currentIdx ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </div>
        );
      })}
      {cancelled && (
        <span className="ml-2 text-xs font-bold text-destructive">Cancelled</span>
      )}
    </div>
  );
}
