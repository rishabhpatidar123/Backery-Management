import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useCart } from "@/hooks/use-cart";
import { Link } from "wouter";
import { Check } from "lucide-react";

const FLAVORS = ["Vanilla", "Chocolate", "Red Velvet", "Mango", "Strawberry", "Butterscotch"];
const SIZES = [
  { label: "6 inch (8 servings)", price: 899 },
  { label: "8 inch (15 servings)", price: 1499 },
  { label: "10 inch (25 servings)", price: 2299 },
];

const STEPS = ["Flavor", "Size", "Design", "Summary"];

export default function CustomizePage() {
  const { addToCart } = useCart();
  const { data: products = [] } = useQuery<any[]>({
    queryKey: ["/api/products"],
  });
  const [step, setStep] = useState(0);
  const [flavor, setFlavor] = useState(FLAVORS[0]);
  const [sizeIdx, setSizeIdx] = useState(0);
  const [message, setMessage] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("customize-draft");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        setFlavor(d.flavor ?? FLAVORS[0]);
        setSizeIdx(d.sizeIdx ?? 0);
        setMessage(d.message ?? "");
        setPreview(d.preview ?? null);
        setStep(d.step ?? 0);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "customize-draft",
      JSON.stringify({ flavor, sizeIdx, message, preview, step })
    );
  }, [flavor, sizeIdx, message, preview, step]);

  const size = SIZES[sizeIdx];
  const total = size.price + (message ? 50 : 0);

  const addCustomToCart = () => {
    const shell = products[0];
    if (!shell) {
      return;
    }
    const notes = `Custom cake: ${flavor}, ${size.label}${message ? `, Message: ${message}` : ""}`;
    addToCart(
      {
        _id: shell._id,
        name: `Custom ${flavor} Cake`,
        price: total,
        image: preview || shell.image,
      },
      1,
      {
        customizationNotes: notes,
        price: total,
      }
    );
    sessionStorage.removeItem("customize-draft");
  };

  return (
    <CustomerLayout>
      <PageHero
        title="Customize Your Cake"
        subtitle="Build your dream cake in four simple steps"
      />
      <div className="container mx-auto grid gap-10 px-6 py-16 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8 flex gap-2">
            {STEPS.map((s, i) => (
              <button
                key={s}
                onClick={() => setStep(i)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold ${
                  step === i
                    ? "bg-primary text-primary-foreground"
                    : i < step
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="h-4 w-4" /> : i + 1}
                <span className="hidden sm:inline">{s}</span>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
            {step === 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {FLAVORS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFlavor(f)}
                    className={`rounded-xl border p-4 font-medium transition-colors ${
                      flavor === f
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="space-y-3">
                {SIZES.map((s, i) => (
                  <button
                    key={s.label}
                    onClick={() => setSizeIdx(i)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 ${
                      sizeIdx === i ? "border-primary bg-primary/10" : ""
                    }`}
                  >
                    <span>{s.label}</span>
                    <span className="font-bold text-primary">
                      ₹{s.price.toLocaleString("en-IN")}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Message on cake</Label>
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Happy Birthday!"
                    className="mt-2 rounded-xl"
                  />
                </div>
                <div>
                  <Label>Design reference (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    className="mt-2"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () =>
                        setPreview(reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Design preview"
                      className="mt-4 max-h-48 rounded-xl object-cover"
                    />
                  )}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4 text-sm">
                <p>
                  <strong>Flavor:</strong> {flavor}
                </p>
                <p>
                  <strong>Size:</strong> {size.label}
                </p>
                {message && (
                  <p>
                    <strong>Message:</strong> {message}
                  </p>
                )}
                <p className="text-2xl font-bold text-primary">
                  Total: ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-between">
              <Button
                variant="outline"
                disabled={step === 0}
                onClick={() => setStep((s) => s - 1)}
                className="rounded-full"
              >
                Back
              </Button>
              {step < 3 ? (
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="rounded-full"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={addCustomToCart}
                  className="rounded-full"
                  disabled={!products.length}
                >
                  Add to Cart
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-2xl border border-border bg-card p-6 shadow-md lg:sticky lg:top-28">
          <h3 className="font-serif text-xl font-bold">Live Summary</h3>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Flavor: {flavor}</li>
            <li>Size: {size.label}</li>
            {message && <li>Message: {message}</li>}
          </ul>
          <p className="mt-6 text-2xl font-bold text-primary">
            ₹{total.toLocaleString("en-IN")}
          </p>
          <Link href="/cart">
            <Button variant="outline" className="mt-4 w-full rounded-full">
              View Cart
            </Button>
          </Link>
        </aside>
      </div>
    </CustomerLayout>
  );
}
