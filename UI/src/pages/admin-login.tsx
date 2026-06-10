import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const { user, login, isLoading, isAuthenticated } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated && user?.isAdmin) {
      setLocation("/admin/dashboard");
    } else if (isAuthenticated && user && !user.isAdmin) {
      setLocation("/profile");
    }
  }, [user, isLoading, isAuthenticated, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsSubmitting(true);
    const success = await login(username, password);
    setIsSubmitting(false);

    if (success) {
      const saved = localStorage.getItem("user");
      const parsed = saved ? JSON.parse(saved) : null;
      if (!parsed?.isAdmin) {
        setLocation("/products");
        return;
      }
      setLocation("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between animate-in fade-in duration-500">
      <Navbar />

      <div className="container mx-auto px-6 py-32 flex justify-center flex-grow items-center">
        <div className="bg-white p-8 lg:p-12 rounded-3xl border border-border/40 shadow-sm max-w-md w-full space-y-8 animate-in zoom-in-95 duration-400">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-serif font-bold text-accent">Admin Portal</h1>
            <p className="text-muted-foreground text-sm">
              Please enter your admin credentials to access the bakery management dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background border-border rounded-xl focus:border-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background border-border rounded-xl focus:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                "Log In to Dashboard"
              )}
            </Button>
          </form>

          {/* Quick Info Alert */}
          <div className="bg-secondary/20 p-4 rounded-xl border border-border/40 text-xs text-muted-foreground leading-relaxed text-center">
            <p className="font-bold mb-1 text-accent">💡 Demonstration Account</p>
            Username: <span className="font-mono text-primary font-bold">admin</span> & Password: <span className="font-mono text-primary font-bold">adminpassword</span>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
