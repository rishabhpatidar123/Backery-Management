import { Link } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ShoppingBag, LogOut, Package } from "lucide-react";

function ProfileContent() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto max-w-2xl px-6 py-28">
      <h1 className="font-serif text-4xl font-bold">My Profile</h1>
      <p className="mt-2 text-muted-foreground">
        Manage your account and quick links to orders
      </p>

      <Card className="mt-10 overflow-hidden rounded-2xl shadow-md">
        <CardHeader className="bg-primary/10">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <CardTitle className="font-serif text-2xl">
                {user.username}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {user.isAdmin ? "Administrator" : "Customer account"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-3 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">Username:</span>
            <span className="font-medium">{user.username}</span>
          </div>

          <div className="grid gap-3 pt-4 sm:grid-cols-2">
            <Link href="/my-orders">
              <Button variant="outline" className="w-full rounded-xl">
                <Package className="mr-2 h-4 w-4" /> My Orders
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="outline" className="w-full rounded-xl">
                <ShoppingBag className="mr-2 h-4 w-4" /> View Cart
              </Button>
            </Link>
          </div>

          {user.isAdmin && (
            <Link href="/admin/dashboard">
              <Button className="mt-2 w-full rounded-xl">
                Open admin dashboard
              </Button>
            </Link>
          )}

          <Button
            variant="destructive"
            className="mt-4 w-full rounded-xl"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <CustomerLayout>
      <ProfileContent />
    </CustomerLayout>
  );
}
