import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import aboutImg from "@/assets/images/about-baker.png";

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <img src={aboutImg} alt="Our Baker" className="w-full object-cover" />
            </div>
            <div className="absolute -top-6 -left-6 w-full h-full border-4 border-primary rounded-2xl -z-0 rotate-[-3deg]" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white rounded-full p-4 flex items-center justify-center shadow-xl z-20">
              <div className="text-center">
                <span className="block text-3xl font-bold text-accent font-serif">15+</span>
                <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Years of<br/>Baking</span>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-2">Our Story</h2>
            <h3 className="text-4xl md:text-5xl font-serif font-bold text-accent mb-6">Baking with Love, Since 2010</h3>
            <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
              Founded by master pastry Chef Abhishek Thakur, BAKE ME BLUSH began with a simple mission: to create desserts that not only look spectacular but taste even better. 
            </p>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              We believe in using only the finest ingredients—Madagascar vanilla beans, Belgian chocolate, and locally sourced fruits. Every cake that leaves our kitchen is a work of art, designed to make your celebrations unforgettable.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <Link href="/about">
                     <Button size="lg" className="bg-accent hover:bg-accent/90 text-white rounded-full px-8">
                       Read More
                     </Button>
                      </Link>
              <div className="flex items-center gap-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Abhishekr" alt="Signature" className="w-12 h-12 rounded-full bg-white p-1 shadow-sm" />
                <div>
                  <p className="font-serif font-bold text-foreground">Abhishek Thakur</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Head Baker & Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
