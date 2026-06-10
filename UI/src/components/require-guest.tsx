import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

/** Redirect authenticated users away from login/register. */
export default function RequireGuest({ children }: { children: ReactNode }) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;

    if (user.isAdmin) {
      setLocation("/admin/dashboard");
    } else {
      setLocation("/profile");
    }
  }, [isLoading, isAuthenticated, user, setLocation]);

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (isAuthenticated) return null;

  return <>{children}</>;
}
