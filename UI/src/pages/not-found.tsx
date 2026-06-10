import { Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <CustomerLayout>
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-6 py-32 text-center">
        <AlertCircle className="mb-4 h-12 w-12 text-primary" />
        <h1 className="font-serif text-4xl font-bold">404 — Page Not Found</h1>
        <p className="mt-4 max-w-md text-muted-foreground">
          This page may have been moved or does not exist. Return to our bakery home.
        </p>
        <Link href="/">
          <Button className="mt-8 rounded-full">Back to Home</Button>
        </Link>
      </div>
    </CustomerLayout>
  );
}
