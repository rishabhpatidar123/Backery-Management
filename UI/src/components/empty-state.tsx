import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-8 py-16 text-center">
      <h3 className="text-xl font-serif font-bold">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-muted-foreground">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button className="mt-6 rounded-full">{actionLabel}</Button>
        </Link>
      )}
    </div>
  );
}
