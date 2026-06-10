import { Link } from "wouter";

interface CategoryCardProps {
  name: string;
  imageUrl: string;
  href: string;
}

export default function CategoryCard({ name, imageUrl, href }: CategoryCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100">
        <div className="relative mb-4 overflow-hidden rounded-xl bg-orange-50 aspect-[4/3]">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <h4 className="text-center font-serif text-lg font-bold text-gray-800 transition-colors group-hover:text-orange-600">
          {name}
        </h4>
      </div>
    </Link>
  );
}
