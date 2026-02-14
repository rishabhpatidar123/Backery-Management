import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";

const menuItems = {
  cakes: [
    { name: "Classic Vanilla Bean", price: "$35" },
    { name: "Double Chocolate Fudge", price: "$38" },
    { name: "Red Velvet Dream", price: "$40" },
    { name: "Carrot Walnut", price: "$38" },
    { name: "Lemon Raspberry", price: "$42" },
  ],
  pastries: [
    { name: "Butter Croissant", price: "$4.50" },
    { name: "Pain au Chocolat", price: "$5.00" },
    { name: "Almond Danishes", price: "$5.50" },
    { name: "Fruit Tart", price: "$6.00" },
    { name: "Macaron (Box of 6)", price: "$15.00" },
  ],
  cupcakes: [
    { name: "Vanilla Sprinkle", price: "$4.00" },
    { name: "Chocolate Hazelnut", price: "$4.50" },
    { name: "Strawberry Swirl", price: "$4.50" },
    { name: "Salted Caramel", price: "$4.50" },
    { name: "Cookies & Cream", price: "$4.50" },
  ]
};

export default function MenuSection() {
  return (
    <section id="menu" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-2">Fresh From the Oven</h2>
          <h3 className="text-4xl md:text-5xl font-serif font-bold text-accent">Our Menu</h3>
        </div>

        <Tabs defaultValue="cakes" className="w-full max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 mb-12 bg-muted/50 p-1 rounded-full">
            <TabsTrigger value="cakes" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm text-lg font-serif">Cakes</TabsTrigger>
            <TabsTrigger value="pastries" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm text-lg font-serif">Pastries</TabsTrigger>
            <TabsTrigger value="cupcakes" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-accent data-[state=active]:shadow-sm text-lg font-serif">Cupcakes</TabsTrigger>
          </TabsList>
          
          {Object.entries(menuItems).map(([category, items]) => (
            <TabsContent key={category} value={category} className="mt-0">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
              >
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-end justify-between border-b border-border/40 pb-4 group hover:border-primary/30 transition-colors">
                    <div className="flex flex-col">
                      <h4 className="text-xl font-medium text-foreground group-hover:text-accent transition-colors">{item.name}</h4>
                      {/* Optional description could go here */}
                    </div>
                    <div className="flex-grow border-b-2 border-dotted border-border mx-4 mb-2 opacity-50" />
                    <span className="text-xl font-bold text-primary font-serif">{item.price}</span>
                  </div>
                ))}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
