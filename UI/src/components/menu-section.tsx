import SectionHeading from "@/components/section-heading";
import CategoryCard from "@/components/category-card";
import { slugify } from "@/lib/api-adapters/types";
import cakeStrawberry from "@/assets/images/cake-strawberry.png";
import cakeFusion from "@/assets/images/cake-fusion.png";
import cakeChocolate from "@/assets/images/cake-chocolate.png";
import cakeFloral from "@/assets/images/cake-floral.png";


const cakeCategories = [
  { name: "Fusion Cakes", image: cakeFusion },
  { name: "Chocolate Cakes", image: cakeChocolate },
  { name: "Regular Cakes", image: cakeFloral },
  { name: "Cup Cakes", image: cakeStrawberry },
];

export default function MenuSection() {
  return (
    <section id="menu" className="bg-[#fffbf5] py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          eyebrow="Fresh From the Oven"
          title="Our Delicious Cakes"
          subtitle="Select a category to explore our wide collection of baked delights"
          className="text-orange-600 [&_h2]:text-orange-800"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {cakeCategories.map((cat) => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              imageUrl={cat.image}
              href={`/products/category/${slugify(cat.name)}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
