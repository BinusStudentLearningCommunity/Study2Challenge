import { Request, Response, NextFunction } from "express";

export const adminCheck = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.email !== "s2cadmin@gmail.com") {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
    return;
  }
  next();
};
