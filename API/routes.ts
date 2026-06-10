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
        ...["Mango Cake", "Gupchup Malai Cake", "Kaju Katli Cake", "Rasmalai Cake"].map(name => ({
          name,
          description: `Delicious ${name} fusion slice.`,
          price: 399.0,
          image: "/images/cake-strawberry.png",
          category: fusionCat._id,
          isFeatured: true
        })),
        ...["Oreo Cake", "Strawberry Chocolate Cake", "Cherry Choco Cake", "ChocoCharm Cake", "Ferrero Rocher Cake", "Dark Chocolate Cake"].map(name => ({
          name,
          description: `Rich ${name} delight.`,
          price: 499.0,
          image: "/images/cake-chocolate.png",
          category: chocolateCat._id,
          isFeatured: true
        })),
        ...["Black Forest Cake", "Pineapple Cake", "Strawberry Cake", "Black Current Cake", "Butterscotch Cake", "Red Velvet Cake"].map(name => ({
          name,
          description: `Classic ${name} taste.`,
          price: 349.0,
          image: "/images/cake-floral.png",
          category: regularCat._id,
          isFeatured: false
        })),
        ...["Vanilla Sprinkle Cupcake", "Chocolate Hazelnut Cupcake"].map(name => ({
          name,
          description: `Special cupcake.`,
          price: 150.0,
          image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd",
          category: cupcakesCat._id,
          isFeatured: false
        })),
      ];

      await Product.insertMany(productsData);
      console.log("Products seeded successfully!");
      
      const subcatsData = [
        ...["Mango Cake", "Gupchup Malai Cake", "Kaju Katli Cake", "Rasmalai Cake"].map((name, i) => ({ categoryId: "cat-fusion", categoryName: "Fusion Cakes", categorySlug: "fusion-cakes", name, weightLabel: "500g", price: 399, imageUrl: "/images/cake-strawberry.png" })),
        ...["Oreo Cake", "Strawberry Chocolate Cake", "Cherry Choco Cake", "ChocoCharm Cake", "Ferrero Rocher Cake", "Dark Chocolate Cake"].map((name, i) => ({ categoryId: "cat-chocolate", categoryName: "Chocolate Cakes", categorySlug: "chocolate-cakes", name, weightLabel: "500g", price: 499, imageUrl: "/images/cake-chocolate.png" })),
        ...["Black Forest", "Pineapple Cake", "Strawberry Cake", "Black Current Cake", "Butterscotch Cake", "Red Velvet Cake"].map((name, i) => ({ categoryId: "cat-regular", categoryName: "Regular Cakes", categorySlug: "regular-cakes", name, weightLabel: "500g", price: 349, imageUrl: "/images/cake-floral.png" })),
        ...["Vanilla Cup Cake", "Chocolate Cup Cake", "Red Velvet Cup Cake", "Strawberry Cup Cake"].map((name, i) => ({ categoryId: "cat-cup-cakes", categoryName: "Cup Cakes", categorySlug: "cup-cakes", name, weightLabel: "1 pc", price: 199, imageUrl: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd" })),
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
