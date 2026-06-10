import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import StarRating from "@/components/star-rating";
import { getProductRating } from "@/lib/rating";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductDetails() {
  const [, params] = useRoute("/products/p/:id");
  const productId = params?.id;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useQuery<any>({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });

  const { data: allSubcategories = [] } = useQuery<any[]>({
    queryKey: ["/api/subcategories"],
    queryFn: async () => {
      const res = await fetch("/api/subcategories");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    }
  });

  const weightOptions = useMemo(() => {
    const linked = allSubcategories.filter((s) => s.productId === productId);
    if (linked.length > 0) {
      return linked.map((s) => ({
        label: s.weightLabel,
        price: s.price,
      }));
    }
    if (product) {
      return [
        { label: "Standard", price: product.price },
        { label: "500g", price: Math.round(product.price * 0.6) },
        { label: "1kg", price: Math.round(product.price * 1.1) },
      ];
    }
    return [];
  }, [productId, product, allSubcategories]);

  const [selectedWeight, setSelectedWeight] = useState(0);
  const selected = weightOptions[selectedWeight] || { label: "Standard", price: product?.price || 0 };
  const { rating, count } = getProductRating(productId || "");

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-6 py-32">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </CustomerLayout>
    );
  }

  if (error || !product) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-6 py-32 text-center">
          <h2 className="font-serif text-3xl font-bold">Product Not Found</h2>
          <Link href="/products">
            <Button className="mt-6 rounded-full">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Collection
            </Button>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  const handleAdd = () => {
    addToCart(
      { ...product, price: selected.price },
      quantity,
      {
        weightLabel: selected.label,
        price: selected.price,
      }
    );
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-6 py-28">
        <Link href="/products">
          <span className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Back to Collection
          </span>
        </Link>

        <div className="grid gap-12 rounded-3xl border border-border bg-card p-8 shadow-sm lg:grid-cols-2 lg:p-12">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.category?.name || "Bakery"}
            </p>
            <h1 className="font-serif text-4xl font-bold lg:text-5xl">
              {product.name}
            </h1>
            <StarRating rating={rating} count={count} size="md" />
            <p className="text-3xl font-bold text-primary">
              ₹{selected.price.toLocaleString("en-IN")}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {weightOptions.length > 0 && (
            <div>
              <span className="text-sm font-bold uppercase">Weight / Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {weightOptions.map((opt, i) => (
                  <button
                    key={opt.label}
                    onClick={() => setSelectedWeight(i)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedWeight === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex items-center rounded-full border border-border p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="rounded-full p-2 hover:bg-muted"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="rounded-full p-2 hover:bg-muted"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="flex-1 rounded-full py-6 cursor-pointer"
              >
                <ShoppingBag className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
