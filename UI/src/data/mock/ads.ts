import type { MockAd } from "@/lib/api-adapters/types";
import heroImg from "@/assets/images/hero-bakery.png";

export const seedAds: MockAd[] = [
  {
    id: "ad-1",
    title: "Order Fresh Cakes Online",
    flashLine: "Free delivery on orders above ₹999",
    description: "Handcrafted cakes delivered to your doorstep within 24 hours.",
    link: "/products",
    imageUrl: heroImg,
    placement: "home-banner",
    sortOrder: 0,
  },
  {
    id: "ad-2",
    title: "Wedding Season Special",
    flashLine: "15% off custom tier cakes",
    description: "Book your dream wedding cake with our master bakers.",
    link: "/customize",
    imageUrl: heroImg,
    placement: "home-banner",
    sortOrder: 1,
  },
  {
    id: "ad-3",
    title: "Fusion Flavors Week",
    flashLine: "Try our Indian fusion collection",
    description: "Mango, Rasmalai, and Gupchup Malai cakes now available.",
    link: "/products/category/fusion-cakes",
    imageUrl: heroImg,
    placement: "sidebar",
    sortOrder: 2,
  },
];
