import { Router } from "express";
import { Customer } from "../models/Customer";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/users - Admin only list
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ registeredAt: -1 });
    res.json(customers);
  } catch (error) {
    next(error);
  }
});

// PUT /api/users/:id/status - Admin only
router.put("/:id/status", verifyAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/users/:id - Admin only
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
