import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import SectionHeading from "@/components/section-heading";
import { ProductGridSkeleton } from "@/components/loading-skeleton";
import StarRating from "@/components/star-rating";
import { getProductRating } from "@/lib/rating";

export default function FeaturedCakes() {
  const { addToCart } = useCart();
  const { data: products = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/products/featured"],
  });

  return (
    <section id="featured" className="py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Our Masterpieces"
          title="Featured Cakes"
          subtitle="Chef's picks — rotating selection of our most loved creations"
        />

        {isLoading ? (
          <ProductGridSkeleton count={3} />
        ) : products.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Featured cakes coming soon. Browse our full{" "}
            <Link href="/products" className="text-primary underline">
              collection
            </Link>
            .
          </p>
        ) : (
          <Carousel className="mx-auto max-w-5xl">
            <CarouselContent>
              {products.map((cake: any) => {
                const id = cake._id;
                const { rating, count } = getProductRating(id);
                return (
                  <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-md transition-all hover:shadow-xl">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={cake.image}
                          alt={cake.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-6 text-center">
                        <h4 className="font-serif text-xl font-bold">{cake.name}</h4>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {cake.description}
                        </p>
                        <div className="mt-3 flex justify-center">
                          <StarRating rating={rating} count={count} />
                        </div>
                        <p className="mt-3 text-xl font-bold text-primary">
                          ₹{cake.price.toLocaleString("en-IN")}
                        </p>
                        <Button
                          className="mt-4 rounded-full"
                          onClick={() => addToCart(cake)}
                        >
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
