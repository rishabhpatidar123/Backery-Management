import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({
  rating,
  count,
  size = "sm",
}: {
  rating: number;
  count?: number;
  size?: "sm" | "md";
}) {
  const iconClass = size === "md" ? "h-5 w-5" : "h-4 w-4";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-primary" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              iconClass,
              i <= Math.round(rating)
                ? "fill-primary text-primary"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {rating}
        {count != null && ` (${count})`}
      </span>
    </div>
  );
}
