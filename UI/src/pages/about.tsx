import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import SectionHeading from "@/components/section-heading";
import StatCounter from "@/components/stat-counter";
import aboutImg from "@/assets/images/about-baker.png";
import heroImg from "@/assets/images/hero-bakery.png";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function About() {
  return (
    <CustomerLayout>
      <PageHero title="Our Story" subtitle="Baking with love since 2010" />

      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col items-center gap-16 lg:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/2"
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl">
              <img src={aboutImg} alt="Our baker" className="w-full object-cover" loading="lazy" />
            </div>
          </motion.div>
          <div className="lg:w-1/2">
            <p className="text-lg font-bold uppercase tracking-widest text-primary text-center">
              About Us
            </p>
            <div className="mt-6 space-y-8 text-center text-muted-foreground leading-relaxed">
  <p>
    Established in 2010, our bakery started with a simple dream – to fill the
    neighborhood with the aroma of fresh, handmade delights. What began as a
    family passion has grown into a beloved local favorite, where every cake,
    loaf, and pastry is crafted with tradition, love, and the finest ingredients.
  </p>

  <p>
    Our head chef, <span className="font-extrabold">Chef Abhishek Thakur</span>, trained in Paris, brings a unique blend of
    classic European techniques and local flavors to everything we bake. From
    moist chocolate cakes to crusty artisan breads, every bite is a tribute to
    quality and care.
  </p>

  <p>
    Visit us at our cozy café in Indore, Madhya Pradesh. Sit down, sip a latte,
    and watch the world go by with something sweet in hand.
  </p>
</div>
            <Link href="/contact">
              <Button className="mt-8 rounded-full">Visit Our Bakery</Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-2 gap-8 md:grid-cols-4">
          <StatCounter end={15} suffix="+" label="Years of Excellence" />
          <StatCounter end={50} suffix="k+" label="Happy Customers" />
          <StatCounter end={120} suffix="+" label="Cake Varieties" />
          <StatCounter end={25} suffix="+" label="Expert Bakers" />
        </div>
      </div>
    </CustomerLayout>
  );
}
