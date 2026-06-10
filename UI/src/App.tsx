import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/use-auth";
import { CartProvider } from "@/hooks/use-cart";

import Home from "@/pages/home";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import ProductsCatalog from "@/pages/products";
import ProductDetails from "@/pages/product-details";
import SubcategoryDetails from "@/pages/subcategory-details";
import CategoryProducts from "@/pages/category-products";
import CustomizePage from "@/pages/customize";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import {
  ProtectedCartPage,
  ProtectedCheckoutPage,
  ProtectedMyOrdersPage,
  ProtectedProfilePage,
} from "@/lib/protected-pages";
import AdminLoginPage from "@/pages/admin-login";
import AdminRedirect from "@/pages/admin-redirect";
import AdminDashboardPage from "@/pages/admin/dashboard";
import AdminCategoriesPage from "@/pages/admin/categories";
import AdminSubcategoriesPage from "@/pages/admin/subcategories";
import AdminProductsPage from "@/pages/admin/products";
import AdminOrdersPage from "@/pages/admin/orders";
import AdminUsersPage from "@/pages/admin/users";
import AdminAdsPage from "@/pages/admin/ads";
import AdminContactsPage from "@/pages/admin/contacts";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/products" component={ProductsCatalog} />
      <Route path="/products/category/:slug" component={CategoryProducts} />
      <Route path="/products/sub/:name" component={SubcategoryDetails} />
      <Route path="/products/p/:id" component={ProductDetails} />
      <Route path="/customize" component={CustomizePage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/profile" component={ProtectedProfilePage} />
      <Route path="/my-orders" component={ProtectedMyOrdersPage} />
      <Route path="/cart" component={ProtectedCartPage} />
      <Route path="/checkout" component={ProtectedCheckoutPage} />

      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin" component={AdminRedirect} />
      <Route path="/admin/dashboard" component={AdminDashboardPage} />
      <Route path="/admin/categories" component={AdminCategoriesPage} />
      <Route path="/admin/subcategories" component={AdminSubcategoriesPage} />
      <Route path="/admin/products" component={AdminProductsPage} />
      <Route path="/admin/orders" component={AdminOrdersPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/ads" component={AdminAdsPage} />
      <Route path="/admin/contacts" component={AdminContactsPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
