import CustomerLayout from "@/layouts/customer-layout";
import Hero from "@/components/hero";
import FeaturedCakes from "@/components/featured-cakes";
import BestSellers from "@/components/best-sellers";
import AboutSection from "@/components/about-section";
import Reviews from "@/components/reviews";
import SpecialOffersBanner from "@/components/special-offers-banner";
import NewsletterSection from "@/components/newsletter-section";

export default function Home() {
  return (
    <CustomerLayout>
      <Hero />
      <FeaturedCakes />
      <BestSellers />
      <SpecialOffersBanner />
      <AboutSection />
      <Reviews />
      <NewsletterSection />
    </CustomerLayout>
  );
}
