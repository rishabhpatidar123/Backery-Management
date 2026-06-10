import CustomerLayout from "@/layouts/customer-layout";
import PageHero from "@/components/page-hero";
import MenuSection from "@/components/menu-section";

export default function ProductsCatalog() {
  return (
    <CustomerLayout>
      <PageHero
        title="Our Bakery Collection"
        subtitle="Freshly baked daily with premium ingredients"
      />
      <div className="-mt-12">
        <MenuSection />
      </div>
    </CustomerLayout>
  );
}
