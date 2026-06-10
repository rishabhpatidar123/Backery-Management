import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StatCard({
  label,
  value,
  icon: Icon,
  className,
}: {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {Icon && (
          <span className="rounded-lg bg-primary/10 p-2 text-primary">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
      <p className="mt-2 text-3xl font-serif font-bold text-primary">{value}</p>
    </div>
  );
}
