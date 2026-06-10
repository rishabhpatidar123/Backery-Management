import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StarRating from "@/components/star-rating";
import { getProductRating } from "@/lib/rating";
import { ShoppingBag, Eye } from "lucide-react";

export interface ProductCardProduct {
  _id?: string;
  id?: string;
  name: string;
  description?: string;
  price: number;
  image: string;
  category?: { name?: string };
}

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart: () => void;
  onQuickView?: () => void;
  href?: string;
}

export default function ProductCard({
  product,
  onAddToCart,
  onQuickView,
  href,
}: ProductCardProps) {
  const id = product._id || product.id || "";
  const { rating, count } = getProductRating(id || product.name);

  const inner = (
    <Card className="group overflow-hidden rounded-2xl border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {onQuickView && (
            <Button
              size="sm"
              variant="secondary"
              className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView();
              }}
            >
              <Eye className="mr-1 h-4 w-4" /> Quick view
            </Button>
          )}
        </div>
        <div className="p-5">
          {product.category?.name && (
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              {product.category.name}
            </p>
          )}
          <h3 className="mt-1 font-serif text-xl font-bold">{product.name}</h3>
          {product.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {product.description}
            </p>
          )}
          <div className="mt-3">
            <StarRating rating={rating} count={count} />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-primary">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            <Button
              size="sm"
              className="rounded-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onAddToCart();
              }}
            >
              <ShoppingBag className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}
