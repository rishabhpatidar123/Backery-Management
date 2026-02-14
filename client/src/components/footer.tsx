import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-foreground text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          <div className="flex flex-col items-start">
            <h2 className="text-2xl font-serif font-bold text-white mb-6">Sweet Delights<span className="text-primary">.</span></h2>
            <p className="text-white/60 mb-6 leading-relaxed max-w-xs">
              Crafting sweet memories one cake at a time. Visit us for a taste of happiness.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center text-white">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center text-white">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center text-white">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-serif">Quick Links</h3>
            <ul className="space-y-4 text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
              <li><a href="#about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#menu" className="hover:text-primary transition-colors">Menu</a></li>
              <li><a href="#featured" className="hover:text-primary transition-colors">Cakes</a></li>
              <li><a href="#contact" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6 font-serif">Opening Hours</h3>
            <ul className="space-y-3 text-white/60">
              <li className="flex justify-between">
                <span>Monday - Friday</span>
                <span>7:00 AM - 8:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Saturday</span>
                <span>8:00 AM - 9:00 PM</span>
              </li>
              <li className="flex justify-between">
                <span>Sunday</span>
                <span>8:00 AM - 6:00 PM</span>
              </li>
            </ul>
          </div>
          
        </div>

        <div className="border-t border-white/10 mt-16 pt-8 text-center text-white/40 text-sm">
          <p>© {new Date().getFullYear()} Sweet Delights Bakery. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
