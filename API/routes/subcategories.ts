import { Router } from "express";
import { Subcategory } from "../models/Subcategory";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/subcategories - Public list
router.get("/", async (req, res, next) => {
  try {
    const subcats = await Subcategory.find();
    res.json(subcats);
  } catch (error) {
    next(error);
  }
});

// POST /api/subcategories - Admin only
router.post("/", verifyAdmin, async (req, res, next) => {
  try {
    const newSubcat = await Subcategory.create(req.body);
    res.status(201).json(newSubcat);
  } catch (error) {
    next(error);
  }
});

// PUT /api/subcategories/:id - Admin only
router.put("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const subcat = await Subcategory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!subcat) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json(subcat);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/subcategories/:id - Admin only
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const subcat = await Subcategory.findByIdAndDelete(req.params.id);
    if (!subcat) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
