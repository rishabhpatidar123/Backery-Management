import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  service: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export default function ContactForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", service: "Custom Cake", message: "", },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const res = await fetch("/api/contacts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Failed to send message");
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Message Sent!", description: "We'll get back to you regarding your sweet cravings soon.", });
      form.reset();
    },
    onError: () => toast({ title: "Submission Failed", variant: "destructive", description: "Failed to send message" })
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    submitMutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 rounded-2xl border border-border bg-card p-8 shadow-lg">
        <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input className="rounded-xl" placeholder="Your name" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input className="rounded-xl" type="email" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="phone" render={({ field }) => (
            <FormItem><FormLabel>Phone</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <FormField control={form.control} name="service" render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger className="rounded-xl"><SelectValue placeholder="Choose a service" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Custom Cake">Custom Cake</SelectItem>
                  <SelectItem value="Wedding Order">Wedding Order</SelectItem>
                  <SelectItem value="Bulk Order">Bulk Order</SelectItem>
                  <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        <FormField control={form.control} name="message" render={({ field }) => (
            <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-[120px] rounded-xl" placeholder="What would you like?" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        <Button type="submit" className="w-full rounded-full py-6 cursor-pointer" disabled={submitMutation.isPending}>
          {submitMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null} Place Request
        </Button>
      </form>
    </Form>
  );
}
