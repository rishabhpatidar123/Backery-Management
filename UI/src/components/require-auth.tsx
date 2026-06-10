import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

interface RequireAuthProps {
  children: ReactNode;
  /** Block admin accounts (use on customer-only pages if needed) */
  customerOnly?: boolean;
}

export default function RequireAuth({
  children,
  customerOnly = false,
}: RequireAuthProps) {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const redirect = encodeURIComponent(location);
      setLocation(`/login?redirect=${redirect}`);
      return;
    }

    if (customerOnly && user?.isAdmin) {
      setLocation("/admin/dashboard");
    }
  }, [isLoading, isAuthenticated, user, location, setLocation, customerOnly]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!token || !user) return null;
  if (customerOnly && user.isAdmin) return null;

  return <>{children}</>;
}
