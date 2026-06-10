import { Router } from "express";
import { Contact } from "../models/Contact";
import { verifyAdmin } from "../middleware/auth";

const router = Router();

// GET /api/contacts - Admin only list
// Changed to verifyAdmin for secure route
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

// POST /api/contacts - Public (user submits contact form)
router.post("/", async (req, res, next) => {
  try {
    const newContact = await Contact.create(req.body);
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
});

// PUT /api/contacts/:id/status - Admin only
router.put("/:id/status", verifyAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/contacts/:id - Admin only
router.delete("/:id", verifyAdmin, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
});

export default router;
