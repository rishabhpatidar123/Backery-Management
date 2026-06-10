import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  FolderTree,
  Layers,
  Package,
  ShoppingBag,
  Users,
  Megaphone,
  Mail,
  LogOut,
  Menu,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, mock: false },
  { href: "/admin/categories", label: "Categories", icon: FolderTree, mock: false },
  { href: "/admin/subcategories", label: "Subcategories", icon: Layers, mock: true },
  { href: "/admin/products", label: "Products", icon: Package, mock: false },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag, mock: false },
  { href: "/admin/users", label: "Users", icon: Users, mock: true },
  { href: "/admin/ads", label: "Ads", icon: Megaphone, mock: true },
  { href: "/admin/contacts", label: "Contacts", icon: Mail, mock: true },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className="flex flex-col gap-1 p-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = location === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <span
              onClick={onNavigate}
              className={`flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
              {item.mock && (
                <span className="ml-auto rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] text-amber-200">
                  Mock
                </span>
              )}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      setLocation("/admin/login");
      return;
    }
    if (!user?.isAdmin) {
      setLocation("/profile");
    }
  }, [user, isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user?.isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="border-b border-sidebar-border p-6">
          <Link href="/admin/dashboard">
            <span className="cursor-pointer font-serif text-xl font-bold">
              BAKE ME <span className="text-sidebar-primary">BLUSH</span>
            </span>
          </Link>
          <p className="mt-1 text-xs text-sidebar-foreground/60">Admin Panel</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <NavLinks />
        </div>
        <div className="border-t border-sidebar-border p-4">
          <p className="mb-2 truncate text-xs text-sidebar-foreground/70">
            {user.username}
          </p>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex items-center gap-3 lg:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-xl">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
                <NavLinks onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>
            <span className="font-serif font-bold">Admin</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/">
              <Button variant="outline" size="sm" className="rounded-xl">
                View Store
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8">{children}</div>
      </div>
    </div>
  );
}
