import express, { Request, Response, NextFunction } from "express";
import { authenticationToken } from "../middleware/auth.middleware";
import {
  getAllTeams,
  updateTeamStatus,
  getTeamDetail,
} from "../controllers/admin.controller";

const router = express.Router();

const ADMIN_EMAIL = "s2cadmin@gmail.com";

interface RequestWithUser extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

// Middleware untuk cek admin
const isAdmin = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user || req.user.email !== ADMIN_EMAIL) {
      res.status(403).json({ message: "Access denied: Admin only" });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

router.get("/teams", authenticationToken, isAdmin, getAllTeams);
router.get("/teams/:teamId", authenticationToken, isAdmin, getTeamDetail);
router.patch(
  "/teams/:teamId/status",
  authenticationToken,
  isAdmin,
  updateTeamStatus
);

export default router;
