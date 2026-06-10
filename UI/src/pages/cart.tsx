import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import EmptyState from "@/components/empty-state";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal } = useCart();

  return (
    <CustomerLayout>
      <div className="container mx-auto max-w-6xl px-6 py-28">
        <h1 className="mb-8 font-serif text-4xl font-bold">Your Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Discover our handcrafted cakes and add something sweet."
            actionLabel="Browse Collection"
            actionHref="/products"
          />
        ) : (
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.lineKey}
                  className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 shadow-sm sm:flex-row sm:items-center"
                >
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      loading="lazy"
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-serif text-lg font-bold">{item.name}</h4>
                    {item.weightLabel && (
                      <p className="text-sm text-primary">{item.weightLabel}</p>
                    )}
                    {item.customizationNotes && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {item.customizationNotes}
                      </p>
                    )}
                    <button
                      onClick={() => removeFromCart(item.lineKey!)}
                      className="mt-2 flex items-center gap-1 text-xs font-bold text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center rounded-full border border-border p-1">
                      <button
                        onClick={() =>
                          updateQuantity(item.lineKey!, item.quantity - 1)
                        }
                        className="rounded-full p-2 hover:bg-muted"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.lineKey!, item.quantity + 1)
                        }
                        className="rounded-full p-2 hover:bg-muted"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="font-bold text-primary">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-fit rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="font-serif text-2xl font-bold">Order Summary</h3>
              <div className="mt-6 flex justify-between border-b border-border pb-4">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-green-600">
                <span>Delivery</span>
                <span className="font-semibold">FREE</span>
              </div>
              <div className="mt-6 flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">
                  ₹{cartSubtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <Link href="/checkout">
                <Button className="mt-6 w-full rounded-full py-6">
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
