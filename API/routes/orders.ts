import { Router } from "express";
import { Order } from "../models/Order";
import { verifyToken, verifyAdmin, AuthenticatedRequest } from "../middleware/auth";
import jwt from "jsonwebtoken";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "sweet_delights_secret_key";

// POST /api/orders - Place a new order (Supports guests or authenticated users)
router.post("/", async (req, res, next) => {
  const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

  try {
    if (!items || !items.length || !totalAmount || !shippingAddress) {
      return res.status(400).json({ message: "Invalid order details. Items, total, and shipping address are required." });
    }

    // Try to extract user if token exists (optional authentication for orders)
    let userId: string | null = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        userId = decoded.id;
      } catch (err) {
        // Log token error, but continue as guest order if it fails
        console.warn("Invalid token for order, processing as guest");
      }
    }

    const order = await Order.create({
      user: userId,
      items: items.map((item: any) => ({
        product: item.productId,
        quantity: item.quantity,
        price: item.price
      })),
      totalAmount,
      paymentMethod,
      shippingAddress
    });

    const populatedOrder = await Order.findById(order._id).populate("items.product");
    res.status(201).json(populatedOrder);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/my-orders - Get order history of logged-in user
router.get("/my-orders", verifyToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized." });
    }
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// GET /api/orders - Get all orders (Admin only)
router.get("/", verifyAdmin, async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "username")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put("/:id/status", verifyAdmin, async (req, res, next) => {
  const { status } = req.body;
  const allowedStatuses = ["Pending", "Processing", "Shipped", "Completed", "Cancelled"];

  try {
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    const populatedOrder = await Order.findById(order._id)
      .populate("items.product")
      .populate("user", "username");

    res.json(populatedOrder);
  } catch (error) {
    next(error);
  }
});

export default router;
