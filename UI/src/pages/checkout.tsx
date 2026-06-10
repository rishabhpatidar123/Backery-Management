import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useLocation, Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ShoppingBag, CreditCard, Wallet, QrCode } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  address: z.string().min(5, "Address must be at least 5 characters."),
  city: z.string().min(2, "City must be at least 2 characters."),
  zipCode: z.string().min(5, "Zip code must be at least 5 characters."),
  paymentMethod: z.enum(["upi", "cod"], {
    required_error: "Please select a payment method.",
  }),
});

export default function CheckoutPage() {
  const { cartItems, cartSubtotal, clearCart, getCustomizationSummary } = useCart();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [orderSuccess, setOrderSuccess] = useState<any | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zipCode: "",
      paymentMethod: undefined
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartSubtotal,
        paymentMethod: values.paymentMethod,
        shippingAddress: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          address: `${getCustomizationSummary()} ${values.address}`.trim(),
          city: values.city,
          zipCode: values.zipCode
        }
      };

      const token = localStorage.getItem("token");
      const headers: any = { "Content-Type": "application/json" };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers,
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const data = await res.json();
      setOrderSuccess(data);
      clearCart();
      toast({
        title: "Order Placed!",
        description: "Your dessert order has been placed successfully."
      });
    } catch (err: any) {
      toast({
        title: "Checkout Error",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <CustomerLayout>
        <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center px-6 py-32 text-center">
          <h2 className="font-serif text-3xl font-bold">No items to checkout</h2>
          <p className="mt-2 text-muted-foreground">
            Add some sweet treats to your cart before checking out.
          </p>
          <Link href="/products">
            <Button className="mt-6 rounded-full">Go to Catalog</Button>
          </Link>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="container mx-auto max-w-5xl px-6 py-28">
        {orderSuccess ? (
          /* Order Success Screen */
          <div className="bg-white p-12 rounded-3xl border border-border/40 text-center max-w-xl mx-auto shadow-sm space-y-6 animate-in zoom-in-95 duration-400">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-4xl font-serif font-bold text-accent">Order Confirmed!</h2>
            <p className="text-muted-foreground">
              Thank you for ordering from BAKE ME BLUSH! Chef Abhishek Thakur and team are starting to prepare your gourmet treats.
            </p>
            
            <div className="bg-secondary/20 p-6 rounded-2xl text-left space-y-2 text-sm border border-border/40">
              <p className="font-bold text-foreground">Order ID: <span className="font-mono text-xs text-primary">{orderSuccess._id}</span></p>
              <p className="font-bold text-foreground">Total: <span className="text-accent">₹{orderSuccess.totalAmount.toFixed(2)}</span></p>
              <p className="font-bold text-foreground">Payment Method: <span className="uppercase text-primary">{orderSuccess.paymentMethod || 'Confirmed'}</span></p>
              <p className="font-bold text-foreground">Deliver To: <span className="font-normal">{orderSuccess.shippingAddress.address}, {orderSuccess.shippingAddress.city}</span></p>
              <p className="font-bold text-foreground">Estimated Delivery: <span className="text-green-600">Within 24 hours</span></p>
            </div>

            <Link href="/products">
              <Button className="bg-primary text-primary-foreground font-bold rounded-full px-8 py-5 shadow-md cursor-pointer">
                Order More Desserts
              </Button>
            </Link>
          </div>
        ) : (
          /* Checkout Billing and Form details */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in slide-in-from-bottom-8 duration-500">
            
            {/* Form Fields */}
            <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-border/40 shadow-sm">
              <h2 className="text-3xl font-serif font-bold text-accent mb-6">Delivery Details</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  
                  {/* Personal info */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">1</span>
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" {...field} className="bg-background border-border rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="98765 43210" {...field} className="bg-background border-border rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="john@example.com" {...field} className="bg-background border-border rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-4 pt-4">
                    <h3 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">2</span>
                      Shipping Location
                    </h3>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Sweet Lane" {...field} className="bg-background border-border rounded-xl" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Sweet City" {...field} className="bg-background border-border rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Zip Code</FormLabel>
                            <FormControl>
                              <Input placeholder="90210" {...field} className="bg-background border-border rounded-xl" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-6 pt-4">
                    <h3 className="text-sm font-bold tracking-widest text-primary uppercase flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px]">3</span>
                      Payment Method
                    </h3>
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="grid grid-cols-1 gap-4"
                            >
                              <FormItem>
                                <FormLabel className="cursor-pointer block">
                                  <FormControl>
                                    <RadioGroupItem value="upi" className="sr-only" />
                                  </FormControl>
                                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${field.value === 'upi' ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border/40 hover:border-primary/20 bg-secondary/10'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${field.value === 'upi' ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                                          <QrCode className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-lg text-foreground">Pay via UPI QR Code</span>
                                      </div>
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'upi' ? 'border-primary bg-primary' : 'border-border'}`}>
                                        {field.value === 'upi' && <div className="w-2 h-2 rounded-full bg-white" />}
                                      </div>
                                    </div>
                                    
                                    {field.value === 'upi' && (
                                      <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <div className="bg-white p-3 rounded-2xl border border-border/40 inline-block shadow-sm">
                                          <img src="/images/upi-qr.png" alt="UPI QR Code" className="w-40 h-40 object-contain mx-auto" />
                                        </div>
                                        <div className="text-sm space-y-2">
                                          <p className="text-muted-foreground font-medium">Scan QR with PhonePe, Google Pay, Paytm or any UPI app.</p>
                                          <div className="bg-background/50 p-2 rounded-lg border border-border/20 inline-flex items-center gap-2">
                                            <span className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">UPI ID:</span>
                                            <span className="font-mono font-bold text-primary">bakemeblush@ybl</span>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </FormLabel>
                              </FormItem>

                              <FormItem>
                                <FormLabel className="cursor-pointer block">
                                  <FormControl>
                                    <RadioGroupItem value="cod" className="sr-only" />
                                  </FormControl>
                                  <div className={`p-6 rounded-2xl border-2 transition-all duration-300 ${field.value === 'cod' ? 'border-primary bg-primary/5 shadow-md ring-1 ring-primary/20' : 'border-border/40 hover:border-primary/20 bg-secondary/10'}`}>
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${field.value === 'cod' ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                                          <Wallet className="w-5 h-5" />
                                        </div>
                                        <div>
                                          <span className="font-bold text-lg text-foreground block">Cash on Delivery (COD)</span>
                                          <p className="text-sm text-muted-foreground mt-1">Pay in cash when your order is delivered.</p>
                                        </div>
                                      </div>
                                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${field.value === 'cod' ? 'border-primary bg-primary' : 'border-border'}`}>
                                        {field.value === 'cod' && <div className="w-2 h-2 rounded-full bg-white" />}
                                      </div>
                                    </div>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white font-bold py-7 rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={form.formState.isSubmitting || !form.watch("paymentMethod")}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" /> Processing Order...
                      </>
                    ) : (
                      `Place Order (₹${cartSubtotal.toFixed(2)})`
                    )}
                  </Button>

                </form>
              </Form>
            </div>

            {/* Cart Preview */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-border/40 shadow-sm h-fit space-y-6">
              <h3 className="text-xl font-serif font-bold text-accent">Order Summary</h3>
              <div className="divide-y divide-border/40 max-h-[300px] overflow-y-auto pr-2">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3.5 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-secondary/30" />
                      <div>
                        <p className="font-bold text-foreground line-clamp-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-serif font-bold text-accent">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border/40 pt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">₹{cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery fee</span>
                  <span className="text-green-600 font-semibold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-serif font-bold text-foreground pt-2">
                  <span>Grand Total</span>
                  <span className="text-accent text-xl">₹{cartSubtotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
