import { motion } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import strawberryCake from "@/assets/images/cake-strawberry.png";
import chocolateCake from "@/assets/images/cake-chocolate.png";
import floralCake from "@/assets/images/cake-floral.png";

const cakes = [
  {
    id: 1,
    name: "Strawberry Dream",
    description: "Light sponge cake with fresh strawberries and vanilla cream.",
    price: "$45.00",
    image: strawberryCake,
  },
  {
    id: 2,
    name: "Midnight Chocolate",
    description: "Rich dark chocolate layers with ganache and gold leaf.",
    price: "$55.00",
    image: chocolateCake,
  },
  {
    id: 3,
    name: "Spring Floral",
    description: "Vanilla bean cake with buttercream flowers and lemon curd.",
    price: "$65.00",
    image: floralCake,
  },
];

export default function FeaturedCakes() {
  return (
    <section id="featured" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-2">Our Masterpieces</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-accent">Signature Cakes</h3>
          <div className="w-24 h-1 bg-primary mx-auto mt-6 rounded-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {cakes.map((cake, index) => (
            <motion.div
              key={cake.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card className="border-none shadow-none bg-transparent overflow-visible group">
                <CardContent className="p-0 relative">
                  <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg mb-6 bg-white">
                    <img 
                      src={cake.image} 
                      alt={cake.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                    <Button 
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-white text-accent hover:bg-white/90 shadow-lg rounded-full"
                    >
                      Add to Cart
                    </Button>
                  </div>
                  <div className="text-center">
                    <h4 className="text-2xl font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{cake.name}</h4>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed px-4">{cake.description}</p>
                    <p className="text-xl font-bold text-accent font-serif">{cake.price}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
