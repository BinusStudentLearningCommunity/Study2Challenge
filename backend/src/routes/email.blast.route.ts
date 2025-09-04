import express from "express";
import {
  getAllEmails,
  addEmail,
  sendBlastEmail,
} from "../controllers/email.blast.controller";
import { authenticationToken } from "../middleware/auth.middleware";
import { adminCheck } from "../middleware/admin.middleware";

const router = express.Router();

// Only admin can access these routes
router.get("/emails", authenticationToken, adminCheck, getAllEmails);
router.post("/emails", authenticationToken, adminCheck, addEmail);
router.post("/send-blast", authenticationToken, adminCheck, sendBlastEmail);

export default router;
