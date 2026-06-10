import { useRoute, Link, useLocation } from "wouter";
import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import SubCategoryCard from "@/components/subcategory-card";
import { useQuery } from "@tanstack/react-query";

export default function CategoryProducts() {
  const [, params] = useRoute("/products/category/:slug");
  const [, setLocation] = useLocation();
  const slug = params?.slug ?? "";
  
  const { data: allItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/subcategories"],
    queryFn: async () => {
      const res = await fetch("/api/subcategories");
      if (!res.ok) throw new Error("Failed to load subcategories");
      return res.json();
    }
  });
  const items = allItems.filter(s => s.categorySlug === slug);
  const title = items[0]?.categoryName ?? slug.replace(/-/g, " ");

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    if (!acc[item.name]) acc[item.name] = [];
    acc[item.name].push(item);
    return acc;
  }, {});

  return (
    <CustomerLayout>
      <PageHero
        title={`${title} Subcategories`}
        subtitle="Select a cake below to view more details and variations"
      />
      <div className="container mx-auto px-6 py-16 bg-[#fffbf5] min-h-screen">
        <Link href="/">
          <span className="text-sm font-medium text-orange-600 hover:text-orange-800 transition-colors hover:underline mb-8 inline-block">← Back to Menu</span>
        </Link>
        {isLoading ? (
          <p className="mt-12 text-center text-muted-foreground">Loading subcategories...</p>
        ) : items.length === 0 ? (
          <p className="mt-12 text-center text-muted-foreground">
            No subcategories in this category yet. Browse{" "}
            <Link href="/products" className="text-orange-600 underline">
              all products
            </Link>
            .
          </p>
        ) : (
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Object.entries(grouped).map(([name, variants]) => {
              const primary = variants[0];
              return (
                  <SubCategoryCard
                    key={name}
                    name={name}
                    imageUrl={primary.imageUrl}
                    onClick={() => setLocation(`/products/sub/${encodeURIComponent(name)}`)}
                  />
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
