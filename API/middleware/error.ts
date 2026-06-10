import { Request, Response, NextFunction } from "express";

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("Server Error:", err);

  const status = err.status || err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists.`;
    return res.status(400).json({ message });
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val: any) => val.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  res.status(status).json({ message });
}
