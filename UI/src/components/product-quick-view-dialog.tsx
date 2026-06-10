import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/star-rating";
import { getProductRating } from "@/lib/rating";
import { Link } from "wouter";
import type { ProductCardProduct } from "@/components/product-card";

export default function ProductQuickViewDialog({
  product,
  open,
  onOpenChange,
  onAddToCart,
  detailHref,
}: {
  product: ProductCardProduct | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddToCart: () => void;
  detailHref?: string;
}) {
  if (!product) return null;
  const id = product._id || product.id || product.name;
  const { rating, count } = getProductRating(id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{product.name}</DialogTitle>
        </DialogHeader>
        <img
          src={product.image}
          alt={product.name}
          className="aspect-video w-full rounded-xl object-cover"
        />
        <StarRating rating={rating} count={count} size="md" />
        {product.description && (
          <p className="text-sm text-muted-foreground">{product.description}</p>
        )}
        <p className="text-2xl font-bold text-primary">
          ₹{product.price.toLocaleString("en-IN")}
        </p>
        <div className="flex gap-3">
          <Button className="flex-1 rounded-full" onClick={onAddToCart}>
            Add to cart
          </Button>
          {detailHref && (
            <Link href={detailHref}>
              <Button variant="outline" className="rounded-full">
                Full details
              </Button>
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
