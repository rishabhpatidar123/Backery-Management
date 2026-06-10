import RequireAuth from "@/components/require-auth";
import CartPage from "@/pages/cart";
import CheckoutPage from "@/pages/checkout";
import MyOrdersPage from "@/pages/my-orders";
import ProfilePage from "@/pages/profile";

export function ProtectedCartPage() {
  return (
    <RequireAuth>
      <CartPage />
    </RequireAuth>
  );
}

export function ProtectedCheckoutPage() {
  return (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  );
}

export function ProtectedMyOrdersPage() {
  return (
    <RequireAuth>
      <MyOrdersPage />
    </RequireAuth>
  );
}

export function ProtectedProfilePage() {
  return (
    <RequireAuth>
      <ProfilePage />
    </RequireAuth>
  );
}
