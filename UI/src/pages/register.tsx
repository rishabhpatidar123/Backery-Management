import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CustomerLayout from "@/layouts/customer-layout";
import RequireGuest from "@/components/require-guest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, UserPlus } from "lucide-react";

const schema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters")
      .max(32, "Username is too long")
      .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [, setLocation] = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSubmitting(true);
    const ok = await registerUser(values.username, values.password);
    setSubmitting(false);

    if (!ok) return;

    const saved = localStorage.getItem("user");
    const parsed = saved ? JSON.parse(saved) : null;

    if (parsed?.isAdmin) {
      setLocation("/admin/dashboard");
      return;
    }

    setLocation("/profile");
  };

  return (
    <div className="flex flex-grow items-center justify-center px-6 py-28">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-card p-8 shadow-lg lg:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join Bake Me Blush to order cakes and track deliveries
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sweet_lover"
                      autoComplete="username"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="At least 6 characters"
                      autoComplete="new-password"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      className="rounded-xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full rounded-full py-6"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Create Account
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <CustomerLayout>
      <RequireGuest>
        <RegisterForm />
      </RequireGuest>
    </CustomerLayout>
  );
}
