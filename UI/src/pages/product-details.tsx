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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ProductDetails() {
  const [, params] = useRoute("/products/p/:id");
  const productId = params?.id;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

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
        { label: "500gms", price: Math.round(product.price * 0.6) },
        { label: "1kg", price: Math.round(product.price * 1.1) },
        { label: "Standard", price: product.price },
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
        message: message,
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-[#2D3142] text-sm font-medium">Weight</Label>
                <Select
                  value={selectedWeight.toString()}
                  onValueChange={(v) => setSelectedWeight(parseInt(v))}
                >
                  <SelectTrigger id="weight" className="h-12 rounded-lg border-gray-200 text-[#2D3142]">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {weightOptions.map((opt, i) => (
                      <SelectItem key={opt.label} value={i.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-[#2D3142] text-sm font-medium">Message on Cake</Label>
                <Input
                  id="message"
                  placeholder="Write your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-12 rounded-lg border-orange-200 focus:border-orange-300 focus:ring-0 text-[#2D3142] placeholder:text-gray-400"
                />
              </div>
            </div>

            <p className="leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            <div className="flex items-center gap-4">
              <div className="flex h-12 items-center rounded-lg border border-gray-100 bg-gray-50/50 px-2">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 transition-colors hover:text-primary"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-12 text-center font-bold text-[#2D3142]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 transition-colors hover:text-primary"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button
                onClick={handleAdd}
                disabled={!product.inStock}
                className="h-12 flex-1 rounded-lg bg-[#2D3142] py-6 font-bold uppercase tracking-wide text-white hover:bg-[#1a1c26] cursor-pointer"
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </div>
    </CustomerLayout>
  );
}
