import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function SpecialOffersBanner() {
  const { data: ads = [] } = useQuery<any[]>({
    queryKey: ["/api/ads"],
    queryFn: async () => {
      const res = await fetch("/api/ads");
      if (!res.ok) throw new Error("Failed");
      return res.json();
    }
  });

  const bannerAds = ads.filter(a => a.placement === "home-banner").slice(0, 2);
  if (bannerAds.length === 0) return null;

  return (
    <section className="py-16">
      <div className="container mx-auto grid gap-6 px-6 md:grid-cols-2">
        {bannerAds.map((ad) => (
          <div
            key={ad._id}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-shadow hover:shadow-xl"
          >
            <img
              src={ad.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover opacity-30"
              loading="lazy"
            />
            <div className="relative z-10 p-8">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary">
                <Sparkles className="h-4 w-4" /> {ad.flashLine}
              </p>
              <h3 className="mt-2 font-serif text-2xl font-bold">{ad.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{ad.description}</p>
              <Link href={ad.link}>
                <Button className="mt-4 rounded-full cursor-pointer">Shop Now</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
