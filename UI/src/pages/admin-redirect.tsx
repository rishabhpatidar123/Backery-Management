import { useEffect } from "react";
import { useLocation } from "wouter";

export default function AdminRedirect() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/admin/dashboard");
  }, [setLocation]);
  return null;
}
