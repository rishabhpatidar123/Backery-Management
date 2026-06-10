import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const reviews = [
  {
    id: 1,
    name: "Raj Thakur",
    role: "Wedding Client",
    text: "The most beautiful wedding cake I could have imagined! Not only did it look stunning with the floral arrangements, but it tasted divine. Every guest complimented the strawberry filling.",
    stars: 5,
  },
  {
    id: 2,
    name: "Manish Kumar",
    role: "Birthday Celebration",
    text: "Ordered a custom chocolate drip cake for my wife's 30th. The detail was incredible, and the chocolate was so rich and moist. Sweet Delights never disappoints!",
    stars: 5,
  },
  {
    id: 3,
    name: "Jay Patel",
    role: "Regular Customer",
    text: "I stop by every morning for a croissant and coffee. Their pastries are flaky, buttery perfection. A true gem in our neighborhood.",
    stars: 5,
  },
  {
    id: 4,
    name: "Deepak Singh",
    role: "Corporate Event",
    text: "We ordered 200 cupcakes for our company launch party. They arrived on time, beautifully packaged, and disappeared in minutes. Highly recommended!",
    stars: 5,
  },
];

export default function Reviews() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-lg md:text-xl font-extrabold tracking-[0.2em] uppercase text-primary mb-4">
  What Our Customers Say
</h2>

<h5 className="text-3xl md:text-4xl font-serif font-bold text-accent mb-16 leading-tight">
  Sweet Reviews From
  <br />
  Happy Cake Lovers
</h5>
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {reviews.map((review) => (
              <CarouselItem key={review.id} className="md:basis-1/2 lg:basis-1/3 p-4">
                <Card className="h-full border-none shadow-lg bg-white/50 hover:bg-white transition-colors duration-300">
                  <CardContent className="pt-8 pb-8 px-6 flex flex-col items-center text-center h-full">
                    <div className="flex gap-1 mb-6 text-yellow-400">
                      {[...Array(review.stars)].map((_, i) => (
                        <Star key={i} className="fill-current w-5 h-5" />
                      ))}
                    </div>
                    <p className="text-muted-foreground italic mb-6 leading-relaxed flex-grow">"{review.text}"</p>
                    <div>
                      <h4 className="font-serif font-bold text-lg text-foreground">{review.name}</h4>
                      <p className="text-xs text-primary font-bold uppercase tracking-wide">{review.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex -left-12 border-none bg-secondary text-secondary-foreground hover:bg-primary hover:text-white" />
          <CarouselNext className="hidden md:flex -right-12 border-none bg-secondary text-secondary-foreground hover:bg-primary hover:text-white" />
        </Carousel>
      </div>
    </section>
  );
}
