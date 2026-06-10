import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "sweet_delights_secret_key";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    isAdmin: boolean;
  };
}

export function verifyToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: string;
      username: string;
      isAdmin: boolean;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
}

export function verifyAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden. Admin access required." });
    }
  });
}
