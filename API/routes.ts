import type { Express } from "express";
import { createServer, type Server } from "http";
import mongoose from "mongoose";
import { Category } from "./models/Category";
import { Product } from "./models/Product";
import { User } from "./models/User";
import { Subcategory } from "./models/Subcategory";
import { Customer } from "./models/Customer";
import { Ad } from "./models/Ad";
import { Contact } from "./models/Contact";
import bcrypt from "bcryptjs";

// Routes imports
import authRouter from "./routes/auth";
import categoriesRouter from "./routes/categories";
import productsRouter from "./routes/products";
import ordersRouter from "./routes/orders";
import subcategoriesRouter from "./routes/subcategories";
import adsRouter from "./routes/ads";
import contactsRouter from "./routes/contacts";
import usersRouter from "./routes/users";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register routers
  app.use("/api/auth", authRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/subcategories", subcategoriesRouter);
  app.use("/api/ads", adsRouter);
  app.use("/api/contacts", contactsRouter);
  app.use("/api/users", usersRouter);

  // Auto seed categories and products if empty
  try {
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      console.log("Seeding initial database...");

      const fusionCat = await Category.create({ name: "Fusion Cakes", description: "Delicious modern fusion layer cakes" });
      const chocolateCat = await Category.create({ name: "Chocolate Cakes", description: "Rich chocolate infused cakes" });
      const regularCat = await Category.create({ name: "Regular Cakes", description: "Classic everyday bakery cakes" });
      const cupcakesCat = await Category.create({ name: "Cup Cakes", description: "Bite-sized sweet delight cupcakes" });

      console.log("Categories seeded successfully!");

      // Seed products
      const productsData = [
  // Fusion Cakes
  {
    name: "Mango Cake",
    description: "Delicious Mango Cake fusion slice.",
    price: 299.0,
    image: "/images/cakes/mango-cake.png",
    category: fusionCat._id,
    isFeatured: true
  },
  {
    name: "Gupchup Malai Cake",
    description: "Delicious Gupchup Malai Cake fusion slice.",
    price: 299.0,
    image: "/images/cakes/Gupchup-cake.png",
    category: fusionCat._id,
    isFeatured: true
  },
  {
    name: "Kaju Katli Cake",
    description: "Delicious Kaju Katli Cake fusion slice.",
    price: 299.0,
    image: "/images/cakes/Kaju-cake.png",
    category: fusionCat._id,
    isFeatured: true
  },
  {
    name: "Rasmalai Cake",
    description: "Delicious Rasmalai Cake fusion slice.",
    price: 299.0,
    image: "/images/cakes/Rasmalai-cake.png",
    category: fusionCat._id,
    isFeatured: true
  },

  // Chocolate Cakes
  {
    name: "Oreo Cake",
    description: "Rich Oreo Cake delight.",
    price: 299.0,
    image: "/images/cakes/Oreo-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },
  {
    name: "Strawberry Chocolate Cake",
    description: "Rich Strawberry Chocolate Cake delight.",
    price: 299.0,
    image: "/images/cakes/Strawberrychoco-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },
  {
    name: "Cherry Choco Cake",
    description: "Rich Cherry Choco Cake delight.",
    price: 299.0,
    image: "/images/cakes/Cherry-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },
  {
    name: "ChocoCharm Cake",
    description: "Rich ChocoCharm Cake delight.",
    price: 299.0,
    image: "/images/cakes/Flutter-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },
  {
    name: "Ferrero Rocher Cake",
    description: "Rich Ferrero Rocher Cake delight.",
    price: 299.0,
    image: "/images/cakes/Ferrero-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },
  {
    name: "Dark Chocolate Cake",
    description: "Rich Dark Chocolate Cake delight.",
    price: 299.0,
    image: "/images/cakes/Dark-cake.png",
    category: chocolateCat._id,
    isFeatured: true
  },

  // Regular Cakes
  {
    name: "Black Forest Cake",
    description: "Classic Black Forest Cake taste.",
    price: 299.0,
    image: "/images/cakes/Black-cake.png",
    category: regularCat._id,
    isFeatured: false
  },
  {
    name: "Pineapple Cake",
    description: "Classic Pineapple Cake taste.",
    price: 299.0,
    image: "/images/cakes/Pineapple.png",
    category: regularCat._id,
    isFeatured: false
  },
  {
    name: "Strawberry Cake",
    description: "Classic Strawberry Cake taste.",
    price: 299.0,
    image: "/images/cakes/Strawberry-cakes.png",
    category: regularCat._id,
    isFeatured: false
  },
  {
    name: "Black Current Cake",
    description: "Classic Black Current Cake taste.",
    price: 299.0,
    image: "/images/cakes/Blackcurrent-cake.png",
    category: regularCat._id,
    isFeatured: false
  },
  {
    name: "Butterscotch Cake",
    description: "Classic Butterscotch Cake taste.",
    price: 299.0,
    image: "/images/cakes/Butterscotch-cake.png",
    category: regularCat._id,
    isFeatured: false
  },
  {
    name: "Red Velvet Cake",
    description: "Classic Red Velvet Cake taste.",
    price: 299.0,
    image: "/images/cakes/Redvalvet-cake.png",
    category: regularCat._id,
    isFeatured: false
  },

  // Cup Cakes
{
  name: "Vanilla Cup Cake",
  description: "Special vanilla cupcake.",
  price: 199.0,
  image: "/images/cakes/Vanillacup-cakes.png",
  category: cupcakesCat._id,
  isFeatured: false
},
{
  name: "Chocolate Cup Cake",
  description: "Special chocolate cupcake.",
  price: 199.0,
  image: "/images/cakes/Chocolatecup-cake.png",
  category: cupcakesCat._id,
  isFeatured: false
},
{
  name: "Red Velvet Cup Cake",
  description: "Special red velvet cupcake.",
  price: 199.0,
  image: "/images/cakes/Richoreocup-cake.png",
  category: cupcakesCat._id,
  isFeatured: false
},
{
  name: "Strawberry Cup Cake",
  description: "Special strawberry cupcake.",
  price: 199.0,
  image: "/images/cakes/Strawberrycup-cake.png",
  category: cupcakesCat._id,
  isFeatured: false
}
];

      await Product.insertMany(productsData);
      console.log("Products seeded successfully!");
      
      const subcatsData = [
  // Fusion Cakes
  { categoryId: "cat-fusion", categoryName: "Fusion Cakes", categorySlug: "fusion-cakes", name: "Mango Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/mango-cake.png" },
  { categoryId: "cat-fusion", categoryName: "Fusion Cakes", categorySlug: "fusion-cakes", name: "Gupchup Malai Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Gupchup-cake.png" },
  { categoryId: "cat-fusion", categoryName: "Fusion Cakes", categorySlug: "fusion-cakes", name: "Kaju Katli Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Kaju-cake.png" },
  { categoryId: "cat-fusion", categoryName: "Fusion Cakes", categorySlug: "fusion-cakes", name: "Rasmalai Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Rasmalai-cake.png" },

  // Chocolate Cakes
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "Oreo Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Oreo-cake.png" },
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "Strawberry Chocolate Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Strawberrychoco-cake.png" },
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "Cherry Choco Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Cherry-cake.png" },
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "ChocoCharm Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Flutter-cake.png" },
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "Ferrero Rocher Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Ferrero-cake.png" },
  { categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name: "Dark Chocolate Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Dark-cake.png" },

  // Regular Cakes
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Black Forest Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Black-cake.png" },
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Pineapple Cake", weightLabel: "500g", price: 349, imageUrl: "/images/cakes/Pineapple.png" },
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Strawberry Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Strawberry-cakes.png" },
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Black Current Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Blackcurrent-cake.png" },
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Butterscotch Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Butterscotch-cake.png" },
  { categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name: "Red Velvet Cake", weightLabel: "500g", price: 299, imageUrl: "/images/cakes/Redvalvet-cake.png" },

  // Cup Cakes
  { categoryId: "cat-cup-cakes", categoryName: "Cup Cakes", categorySlug: "cup-cakes", name: "Vanilla Cup Cake", weightLabel: "1 pc", price: 199, imageUrl: "/images/cakes/Vanillacup-cakes.png" },
  { categoryId: "cat-cup-cakes", categoryName: "Cup Cakes", categorySlug: "cup-cakes", name: "Chocolate Cup Cake", weightLabel: "1 pc", price: 199, imageUrl: "/images/cakes/Chocolatecup-cake.png" },
  { categoryId: "cat-cup-cakes", categoryName: "Cup Cakes", categorySlug: "cup-cakes", name: "Red Velvet Cup Cake", weightLabel: "1 pc", price: 199, imageUrl: "/images/cakes/Richoreocup-cake.png" },
  { categoryId: "cat-cup-cakes", categoryName: "Cup Cakes", categorySlug: "cup-cakes", name: "Strawberry Cup Cake", weightLabel: "1 pc", price: 199, imageUrl: "/images/cakes/Strawberrycup-cake.png" },
];
      await Subcategory.insertMany(subcatsData);
      console.log("Subcategories seeded successfully!");
    }

    const customersCount = await Customer.countDocuments();
    if (customersCount === 0) {
      await Customer.insertMany([
        { regId: "REG-1001", name: "Priya Sharma", email: "priya@example.com", mobile: "+91 98765 43210", address: "12 MG Road, Pune", status: "active" },
        { regId: "REG-1002", name: "Rahul Mehta", email: "rahul@example.com", mobile: "+91 91234 56789", address: "45 Park Street, Mumbai", status: "active" },
        { regId: "REG-1003", name: "Ananya Desai", email: "ananya@example.com", mobile: "+91 99887 76655", address: "8 Lake View, Bangalore", status: "blocked" },
      ]);
      console.log("Customers seeded successfully!");
    }

    const adsCount = await Ad.countDocuments();
    if (adsCount === 0) {
      await Ad.insertMany([
        { title: "Order Fresh Cakes Online", flashLine: "Free delivery on orders above ₹999", description: "Handcrafted cakes delivered to your doorstep within 24 hours.", link: "/products", imageUrl: "/images/hero-bakery.png", placement: "home-banner", sortOrder: 0 },
        { title: "Wedding Season Special", flashLine: "15% off custom tier cakes", description: "Book your dream wedding cake with our master bakers.", link: "/customize", imageUrl: "/images/hero-bakery.png", placement: "home-banner", sortOrder: 1 },
        { title: "Fusion Flavors Week", flashLine: "Try our Indian fusion collection", description: "Mango, Rasmalai, and Gupchup Malai cakes now available.", link: "/products/category/fusion-cakes", imageUrl: "/images/hero-bakery.png", placement: "sidebar", sortOrder: 2 },
      ]);
      console.log("Ads seeded successfully!");
    }

    const contactsCount = await Contact.countDocuments();
    if (contactsCount === 0) {
      await Contact.insertMany([
        { name: "Sneha Kapoor", email: "sneha@example.com", phone: "+91 98765 11111", message: "Looking for a 2-tier birthday cake for 50 guests.", service: "Custom Cake", status: "new" },
        { name: "Vikram Singh", email: "vikram@example.com", phone: "+91 91234 22222", message: "Do you offer corporate bulk orders?", service: "Bulk Order", status: "read" },
      ]);
      console.log("Contacts seeded successfully!");
    }

    // Auto seed a default admin account if none exists
    const adminCount = await User.countDocuments({ isAdmin: true });
    if (adminCount === 0) {
      console.log("Seeding default admin user...");
      const hashedPassword = await bcrypt.hash("adminpassword", 10);
      await User.create({
        username: "admin",
        password: hashedPassword,
        isAdmin: true
      });
      console.log("Default admin created successfully! (Username: admin, Password: adminpassword)");
    }

  } catch (error) {
    console.error("Database seeding failed:", error);
  }

  return httpServer;
}
