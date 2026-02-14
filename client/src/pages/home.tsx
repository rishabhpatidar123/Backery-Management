import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import FeaturedCakes from "@/components/featured-cakes";
import MenuSection from "@/components/menu-section";
import AboutSection from "@/components/about-section";
import Reviews from "@/components/reviews";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <FeaturedCakes />
      <MenuSection />
      <AboutSection />
      <Reviews />
      <ContactForm />
      <Footer />
    </div>
  );
}
