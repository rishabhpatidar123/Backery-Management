import type { Subcategory } from "@/lib/api-adapters/types";
import { slugify } from "@/lib/api-adapters/types";
import strawberryCake from "@/assets/images/cake-strawberry.png";
import chocolateCake from "@/assets/images/cake-chocolate.png";
import floralCake from "@/assets/images/cake-floral.png";

const fusionId = "cat-fusion";
const chocolateId = "cat-chocolate";
const regularId = "cat-regular";
const cupId = "cat-cup-cakes";

const imageMap = [strawberryCake, chocolateCake, floralCake];
let imgIndex = 0;
const getNextImage = () => {
  const img = imageMap[imgIndex % imageMap.length];
  imgIndex++;
  return img;
};

export const seedSubcategories: Subcategory[] = [
  // Fusion Cakes
  ...["Mango Cake", "Gupchup Malai Cake", "Kaju Katli Cake", "Rasmalai Cake"].map((name, i) => ({
    id: `fusion-${i}`,
    categoryId: fusionId,
    categoryName: "Fusion Cakes",
    categorySlug: slugify("Fusion Cakes"),
    name,
    weightLabel: "500g",
    price: 299,
    imageUrl: getNextImage(),
  })),
  // Chocolate Cakes
  ...["Oreo Cake", "Strawberry Chocolate Cake", "Cherry Choco Cake", "ChocoCharm Cake", "Ferrero Rocher Cake", "Dark Chocolate Cake"].map((name, i) => ({
    id: `chocolate-${i}`,
    categoryId: chocolateId,
    categoryName: "Chocolate Cakes",
    categorySlug: slugify("Chocolate Cakes"),
    name,
    weightLabel: "500g",
    price: 299,
    imageUrl: getNextImage(),
  })),
  // Regular Cakes
  ...["Black Forest", "Pineapple Cake", "Strawberry Cake", "Black Current Cake", "Butterscotch Cake", "Red Velvet Cake"].map((name, i) => ({
    id: `regular-${i}`,
    categoryId: regularId,
    categoryName: "Regular Cakes",
    categorySlug: slugify("Regular Cakes"),
    name,
    weightLabel: "500g",
    price: 299,
    imageUrl: getNextImage(),
  })),
  // Cup Cakes
  ...["Vanilla Cup Cake", "Chocolate Cup Cake", "Red Velvet Cup Cake", "Strawberry Cup Cake"].map((name, i) => ({
    id: `cupcakes-${i}`,
    categoryId: cupId,
    categoryName: "Cup Cakes",
    categorySlug: slugify("Cup Cakes"),
    name,
    weightLabel: "1 pc",
    price: 199,
    imageUrl: getNextImage(),
  })),
];
