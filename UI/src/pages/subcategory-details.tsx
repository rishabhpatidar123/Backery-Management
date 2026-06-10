import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import StarRating from "@/components/star-rating";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubcategoryDetails() {
  const [, params] = useRoute("/products/sub/:name");
  const subname = params?.name ? decodeURIComponent(params.name) : "";
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: allSubcategories = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/subcategories"],
    queryFn: async () => {
      const res = await fetch("/api/subcategories");
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    }
  });

  const productVariants = useMemo(() => {
    return allSubcategories.filter((s) => s.name === subname);
  }, [allSubcategories, subname]);

  const [selectedWeight, setSelectedWeight] = useState(0);

  if (isLoading) {
    return (
      <CustomerLayout>
        <div className="container mx-auto px-6 py-32">
          <Skeleton className="h-96 w-full rounded-2xl" />
        </div>
      </CustomerLayout>
    );
  }

  if (productVariants.length === 0) {
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

  const primary = productVariants[0];
  const selected = productVariants[selectedWeight] || primary;

  const handleAdd = () => {
    addToCart(
      { 
        _id: selected._id, 
        name: `${selected.name} (${selected.weightLabel})`, 
        price: selected.price, 
        image: selected.imageUrl,
        inStock: true 
      },
      quantity,
      {
        weightLabel: selected.weightLabel,
        price: selected.price,
      }
    );
  };

  return (
    <CustomerLayout>
      <div className="container mx-auto px-6 py-28">
        <Link href={`/products/category/${primary.categorySlug}`}>
          <span className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Back to {primary.categoryName}
          </span>
        </Link>

        <div className="grid gap-12 rounded-3xl border border-border bg-card p-8 shadow-sm lg:grid-cols-2 lg:p-12">
          <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
            <img
              src={selected.imageUrl || primary.imageUrl}
              alt={selected.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="space-y-6">
            <p className="text-xs font-bold uppercase tracking-wider text-primary">
              {primary.categoryName}
            </p>
            <h1 className="font-serif text-4xl font-bold lg:text-5xl">
              {primary.name}
            </h1>
            <StarRating rating={5} count={12} size="md" />
            <p className="text-3xl font-bold text-primary">
              ₹{selected.price.toLocaleString("en-IN")}
            </p>
            <p className="leading-relaxed text-muted-foreground">
              A delicious and fresh {primary.name} from our {primary.categoryName} collection. 
              Baked to perfection with premium ingredients. Available in multiple weight options.
            </p>

            {productVariants.length > 0 && (
            <div>
              <span className="text-sm font-bold uppercase">Weight / Size</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {productVariants.map((opt, i) => (
                  <button
                    key={opt._id || opt.weightLabel}
                    onClick={() => setSelectedWeight(i)}
                    className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
                      selectedWeight === i
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    {opt.weightLabel}
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
