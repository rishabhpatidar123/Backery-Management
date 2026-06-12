import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag, ArrowLeft, Plus, Minus } from "lucide-react";
import StarRating from "@/components/star-rating";
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

export default function SubcategoryDetails() {
  const [, params] = useRoute("/products/sub/:name");
  const subname = params?.name ? decodeURIComponent(params.name) : "";
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

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
        message: message,
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
                    {productVariants.map((opt, i) => (
                      <SelectItem key={opt._id || opt.weightLabel} value={i.toString()}>
                        {opt.weightLabel}
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
              A delicious and fresh {primary.name} from our {primary.categoryName} collection. 
              Baked to perfection with premium ingredients. Available in multiple weight options.
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
