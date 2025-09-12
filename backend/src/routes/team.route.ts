import { Router } from "express";
import { getMyTeam } from "../controllers/team.controller";
import { authenticationToken } from "../middleware/auth.middleware";

const router = Router();

// Protected route - requires authentication
router.get("/me", authenticationToken, (req, res, next) => {
  getMyTeam(req, res).catch(next);
});

export default router;
