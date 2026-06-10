import { Link } from "wouter";
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-accent text-accent-foreground">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="mb-4 font-serif text-2xl font-bold">
              BAKE ME <span className="text-primary">BLUSH</span>
            </h2>
            <p className="mb-6 max-w-xs text-sm leading-relaxed opacity-80">
              Baked fresh, loved always. Premium handcrafted cakes for every celebration.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-primary"
                  aria-label="Social link"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/products">Our Collection</Link></li>
              <li><Link href="/customize">Customize Cake</Link></li>
              <li><Link href="/about">About Us</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold">Opening Hours</h3>
            <ul className="space-y-2 text-sm opacity-80">
              <li className="flex justify-between gap-4">
                <span>Mon – Fri</span>
                <span>7:00 AM – 8:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Saturday</span>
                <span>8:00 AM – 9:00 PM</span>
              </li>
              <li className="flex justify-between gap-4">
                <span>Sunday</span>
                <span>8:00 AM – 6:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-serif text-lg font-bold">Contact</h3>
            <ul className="space-y-3 text-sm opacity-80">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                123 Baker Street, Sweet City
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                hello@bakemeblush.com
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm opacity-60">
          <p>© {new Date().getFullYear()} Bake Me Blush. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
