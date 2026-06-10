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
import { Loader2, LogIn } from "lucide-react";

const schema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

function getRedirectPath(): string {
  const params = new URLSearchParams(window.location.search);
  const redirect = params.get("redirect");
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }
  return "/profile";
}

function LoginForm() {
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof schema>) => {
    setSubmitting(true);
    const ok = await login(values.username, values.password);
    setSubmitting(false);

    if (!ok) return;

    const saved = localStorage.getItem("user");
    const parsed = saved ? JSON.parse(saved) : null;

    if (parsed?.isAdmin) {
      setLocation("/admin/dashboard");
      return;
    }

    setLocation(getRedirectPath());
  };

  return (
    <div className="flex flex-grow items-center justify-center px-6 py-28">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-border bg-card p-8 shadow-lg lg:p-10">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
            <LogIn className="h-5 w-5" />
          </div>
          <h1 className="font-serif text-3xl font-bold">Sign In</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Access your cart, orders, and profile
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
                      placeholder="your_username"
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
                      placeholder="••••••••"
                      autoComplete="current-password"
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
              Sign In
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Bakery staff?{" "}
          <Link href="/admin/login" className="text-primary hover:underline">
            Admin portal
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <CustomerLayout>
      <RequireGuest>
        <LoginForm />
      </RequireGuest>
    </CustomerLayout>
  );
}
