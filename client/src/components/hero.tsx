import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import heroBg from "@/assets/images/hero-bakery.png";

export default function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax-like fixed attachment or absolute positioning */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/20" /> {/* Subtle overlay */}
      </div>

      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-white/30 backdrop-blur-md text-white border border-white/50 text-xs font-bold uppercase tracking-widest mb-4">
            Artisanal Bakery
          </span>
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white mb-6 drop-shadow-lg leading-tight"
        >
          Taste the <br/>
          <span className="text-primary-foreground italic">Sweetness</span> of Life
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-white/90 max-w-2xl mb-10 font-medium drop-shadow-md"
        >
          Handcrafted cakes, pastries, and treats made with love and the finest ingredients for your special moments.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-8 py-6 text-lg shadow-xl hover:scale-105 transition-transform">
            View Menu
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/40 backdrop-blur-sm font-semibold rounded-full px-8 py-6 text-lg hover:scale-105 transition-transform">
            Customize Cake
          </Button>
        </motion.div>
      </div>
      
      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div className="w-1 h-2 bg-white rounded-full mt-1" />
        </div>
      </motion.div>
    </section>
  );
}
