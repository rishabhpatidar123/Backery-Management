import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/product-card";
import SectionHeading from "@/components/section-heading";
import { ProductGridSkeleton } from "@/components/loading-skeleton";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import ProductQuickViewDialog from "@/components/product-quick-view-dialog";

export default function BestSellers() {
  const { addToCart } = useCart();
  const [quickView, setQuickView] = useState<any | null>(null);

  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });

  const best = [...products]
    .filter((p) => p.inStock !== false)
    .sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0))
    .slice(0, 4);

  return (
    <section className="bg-muted/40 py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Customer Favorites"
          title="Best Sellers"
          subtitle="Our most ordered cakes this season"
        />
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {best.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                href={`/products/p/${product._id}`}
                onAddToCart={() => addToCart(product)}
                onQuickView={() => setQuickView(product)}
              />
            ))}
          </div>
        )}
        <ProductQuickViewDialog
          product={quickView}
          open={!!quickView}
          onOpenChange={(o) => !o && setQuickView(null)}
          onAddToCart={() => {
            if (quickView) addToCart(quickView);
            setQuickView(null);
          }}
          detailHref={quickView ? `/products/p/${quickView._id}` : undefined}
        />
      </div>
    </section>
  );
}
