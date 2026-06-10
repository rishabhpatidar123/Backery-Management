import { Router } from "express";
import { Category } from "../models/Category";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/categories - Public list
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// POST /api/categories - Admin only
router.post("/", verifyAdmin, async (req, res, next) => {
  const { name, description } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Category name is required." });
    }
    const newCategory = await Category.create({ name, description });
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});
// PUT /api/categories/:id - Admin only
router.put("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/categories/:id - Admin only
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
});
export default router;
