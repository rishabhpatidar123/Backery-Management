interface SubCategoryCardProps {
  name: string;
  imageUrl: string;
  onClick: () => void;
}

export default function SubCategoryCard({ name, imageUrl, onClick }: SubCategoryCardProps) {
  return (
    <div 
      className="group cursor-pointer rounded-2xl bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-orange-50/50 mb-4">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="text-center pb-2">
        <h3 className="font-serif text-lg font-bold text-gray-800 transition-colors group-hover:text-orange-600">{name}</h3>
        <p className="mt-1 text-xs font-bold text-orange-500">
          Click to view
        </p>
      </div>
    </div>
  );
}
