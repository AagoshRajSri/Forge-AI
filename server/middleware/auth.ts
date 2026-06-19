import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers as unknown as Headers });
    if (!session?.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.userId = session.user.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid session" });
  }
};
