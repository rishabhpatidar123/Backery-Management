import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import heroBg from "@/assets/images/hero-bakery.png";

export default function Hero() {
  return (
    <section className="relative flex h-screen min-h-[600px] w-full items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background/90" />

      <div className="container relative z-10 mx-auto px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block rounded-full border border-white/30 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md"
        >
          Artisanal Bakery
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 font-serif text-5xl font-bold leading-tight text-white drop-shadow-lg md:text-7xl lg:text-8xl"
        >
          Baked <span className="text-primary">Fresh</span>,<br />
          Loved Always
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
         className="mx-auto mt-6 max-w-2xl text-lg font-semibold text-white drop-shadow-lg md:text-xl"
        >
          Handcrafted cakes, fusion flavors, and custom designs for weddings,
          birthdays, and every sweet moment.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
        >
          <Link href="/products">
            <Button
              size="lg"
              className="rounded-full px-10 py-6 text-lg shadow-xl"
            >
              Explore Collection
            </Button>
          </Link>
          <Link href="/customize">
            <Button
              size="lg"
              variant="outline"
              className="rounded-full border-white/50 bg-white/10 px-10 py-6 text-lg text-white backdrop-blur hover:bg-white/20"
            >
              Customize Your Cake
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
