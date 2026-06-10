import { Router } from "express";
import { Ad } from "../models/Ad";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/ads - Public list
router.get("/", async (req, res, next) => {
  try {
    const ads = await Ad.find().sort({ sortOrder: 1 });
    res.json(ads);
  } catch (error) {
    next(error);
  }
});

// POST /api/ads - Admin only
router.post("/", verifyAdmin, async (req, res, next) => {
  try {
    const count = await Ad.countDocuments();
    const newAd = await Ad.create({ ...req.body, sortOrder: req.body.sortOrder ?? count });
    res.status(201).json(newAd);
  } catch (error) {
    next(error);
  }
});

// PUT /api/ads/reorder - Admin only
router.put("/reorder", verifyAdmin, async (req, res, next) => {
  try {
    const { ids } = req.body; // Array of ordered IDs
    if (Array.isArray(ids)) {
      for (let i = 0; i < ids.length; i++) {
        await Ad.findByIdAndUpdate(ids[i], { sortOrder: i });
      }
    }
    res.json({ message: "Reordered successfully" });
  } catch (error) {
    next(error);
  }
});

// PUT /api/ads/:id - Admin only
router.put("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json(ad);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/ads/:id - Admin only
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const ad = await Ad.findByIdAndDelete(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: "Ad not found" });
    }
    res.json({ message: "Ad deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
