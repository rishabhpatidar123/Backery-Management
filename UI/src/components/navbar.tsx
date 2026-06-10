import { Link, useLocation } from "wouter";
import { ShoppingBag, Menu, Sparkles, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  const { totalItems } = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Collection", href: "/products" },
    { name: "Customize", href: "/customize" },
    { name: "Our Story", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const isHome = location === "/";

  const linkClass = (href: string, active?: boolean) =>
    `cursor-pointer text-sm font-medium uppercase tracking-wide transition-colors ${
      active || location === href
        ? "font-bold text-primary"
        : isScrolled || !isHome
          ? "text-foreground/80 hover:text-primary"
          : "text-white/90 hover:text-primary"
    }`;

  const AuthLinksDesktop = () => {
    if (isLoading) return null;

    if (!isAuthenticated) {
      return (
        <>
          <Link href="/login">
            <span className={linkClass("/login")}>
              <span className="inline-flex items-center gap-1">
                <LogIn className="h-3.5 w-3.5" /> Login
              </span>
            </span>
          </Link>
          <Link href="/register">
            <Button size="sm" variant="outline" className="hidden rounded-full md:inline-flex">
              <UserPlus className="mr-1 h-3.5 w-3.5" /> Register
            </Button>
          </Link>
        </>
      );
    }

    return (
      <>
        {!user?.isAdmin && (
          <Link href="/my-orders">
            <span className={linkClass("/my-orders")}>My Orders</span>
          </Link>
        )}
        <Link href="/profile">
          <span className={linkClass("/profile")}>
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" /> Profile
            </span>
          </span>
        </Link>
        <Button
          size="sm"
          variant="ghost"
          className={`hidden rounded-full md:inline-flex ${
            isScrolled || !isHome ? "" : "text-white hover:bg-white/10"
          }`}
          onClick={() => {
            logout();
          }}
        >
          <LogOut className="mr-1 h-3.5 w-3.5" /> Logout
        </Button>
        {user?.isAdmin && (
          <Link href="/admin/dashboard">
            <Button size="sm" className="hidden rounded-full md:flex">
              <Sparkles className="mr-1 h-3.5 w-3.5" /> Dashboard
            </Button>
          </Link>
        )}
      </>
    );
  };

  const AuthLinksMobile = () => {
    if (!isAuthenticated) {
      return (
        <>
          <Link href="/login">
            <span className="text-lg font-serif">Login</span>
          </Link>
          <Link href="/register">
            <span className="text-lg font-serif">Register</span>
          </Link>
        </>
      );
    }

    return (
      <>
        <Link href="/profile">
          <span className="text-lg font-serif">Profile</span>
        </Link>
        {!user?.isAdmin && (
          <Link href="/my-orders">
            <span className="text-lg font-serif">My Orders</span>
          </Link>
        )}
        {user?.isAdmin && (
          <Link href="/admin/dashboard">
            <span className="text-lg font-serif">Admin Dashboard</span>
          </Link>
        )}
        <button
          type="button"
          className="text-left text-lg font-serif text-destructive"
          onClick={() => logout()}
        >
          Logout
        </button>
      </>
    );
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || !isHome
          ? "border-b border-border/40 bg-card/90 py-3 shadow-sm backdrop-blur-md dark:bg-card/95"
          : "bg-gradient-to-b from-black/50 to-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link href="/">
          <div
            className={`cursor-pointer font-serif text-2xl font-bold tracking-tight ${
              isScrolled || !isHome ? "text-foreground" : "text-white"
            }`}
          >
            BAKE ME <span className="text-primary">BLUSH</span>
          </div>
        </Link>

        <div className="hidden items-center gap-5 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <span className={linkClass(link.href)}>{link.name}</span>
            </Link>
          ))}
          <AuthLinksDesktop />
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href={isAuthenticated ? "/cart" : "/login?redirect=%2Fcart"}>
            <button
              className={`relative rounded-full p-2.5 transition-all ${
                isScrolled || !isHome
                  ? "text-foreground hover:bg-muted"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </button>
          </Link>

          {!isAuthenticated && !isLoading && (
            <Link href="/login">
              <Button size="sm" className="hidden rounded-full md:flex">
                Sign In
              </Button>
            </Link>
          )}

          <Link href="/products">
            <Button
              className={`hidden rounded-full md:flex ${
                isScrolled || !isHome ? "" : "bg-primary"
              }`}
            >
              Order Now
            </Button>
          </Link>

          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col gap-6 p-8">
                {navLinks.map((link) => (
                  <Link key={link.name} href={link.href}>
                    <span className="text-lg font-serif">{link.name}</span>
                  </Link>
                ))}
                <div className="border-t border-border pt-4">
                  <AuthLinksMobile />
                </div>
                <Link href={isAuthenticated ? "/cart" : "/login?redirect=%2Fcart"}>
                  <Button className="w-full rounded-full">
                    Cart ({totalItems})
                  </Button>
                </Link>
                <Link href="/products">
                  <Button className="w-full rounded-full">Order Now</Button>
                </Link>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
