import { motion } from "framer-motion";
import heroImg from "@/assets/images/hero-bakery.png";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageHero({
  title,
  subtitle,
  backgroundImage = heroImg,
}: PageHeroProps) {
  return (
    <div
      className="relative overflow-hidden bg-cover bg-center py-28 text-center text-white md:py-32"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(31,41,55,0.75), rgba(31,41,55,0.55)), url(${backgroundImage})`,
      }}
    >
      <div className="container relative z-10 mx-auto px-6">
        <motion.h1
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-white md:text-6xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-4 max-w-xl text-lg text-white/85"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </div>
  );
}
