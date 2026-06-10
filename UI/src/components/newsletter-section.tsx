import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
});

export default function NewsletterSection() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: z.infer<typeof schema>) => {
    console.log("Subscribed:", values.email);
    toast({
      title: "Subscribed!",
      description: "You'll receive sweet offers and bakery news.",
    });
    form.reset();
  };

  return (
    <section className="bg-primary py-16 text-primary-foreground">
      <div className="container mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl font-bold">Join Our Sweet Circle</h2>
        <p className="mx-auto mt-2 max-w-md opacity-90">
          Subscribe for exclusive offers, new cake launches, and baking tips.
        </p>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            placeholder="your@email.com"
            className="rounded-full border-0 bg-white text-foreground"
            {...form.register("email")}
          />
          <Button
            type="submit"
            variant="secondary"
            className="rounded-full px-8 font-bold"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </section>
  );
}
