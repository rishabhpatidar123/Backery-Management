import { Router } from "express";
import { Product } from "../models/Product";
import { Category } from "../models/Category";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/products - Public listing (with optional search and category filtering)
router.get("/", async (req, res, next) => {
  const { category, search } = req.query;

  try {
    const filter: any = {};

    if (category) {
      // Find category by name or ID
      const catObj = await Category.findOne({
        $or: [
          { name: new RegExp(category as string, "i") },
          { _id: category.toString().match(/^[0-9a-fA-F]{24}$/) ? category : null }
        ].filter(Boolean)
      });
      if (catObj) {
        filter.category = catObj._id;
      } else {
        // If category is provided but not found, return empty array
        return res.json([]);
      }
    }

    if (search) {
      filter.$or = [
        { name: new RegExp(search as string, "i") },
        { description: new RegExp(search as string, "i") }
      ];
    }

    const products = await Product.find(filter).populate("category").sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/featured - Featured masterpieces
router.get("/featured", async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true }).populate("category").limit(6);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Single product
router.get("/:id", async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Create a new product (Admin only)
router.post("/", verifyAdmin, async (req, res, next) => {
  const { name, description, price, image, category, isFeatured, inStock } = req.body;

  try {
    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "Please provide all required fields (name, description, price, category)." });
    }

    // Verify category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID." });
    }

    const newProduct = await Product.create({
      name,
      description,
      price: Number(price),
      image: image || "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
      category,
      isFeatured: !!isFeatured,
      inStock: inStock !== undefined ? !!inStock : true
    });

    const populatedProduct = await Product.findById(newProduct._id).populate("category");
    res.status(201).json(populatedProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Edit an existing product (Admin only)
router.put("/:id", verifyAdmin, async (req, res, next) => {
  const { name, description, price, image, category, isFeatured, inStock } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID." });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: name || product.name,
        description: description || product.description,
        price: price !== undefined ? Number(price) : product.price,
        image: image || product.image,
        category: category || product.category,
        isFeatured: isFeatured !== undefined ? !!isFeatured : product.isFeatured,
        inStock: inStock !== undefined ? !!inStock : product.inStock
      },
      { new: true }
    ).populate("category");

    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Delete a product (Admin only)
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    next(error);
  }
});

export default router;
