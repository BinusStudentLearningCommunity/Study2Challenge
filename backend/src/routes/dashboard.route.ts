import express from 'express';
import { authenticationToken } from '../middleware/auth.middleware';
import { getDashboardData } from '../controllers/dashboard.controller';

const router = express.Router();
router.get('/', authenticationToken, getDashboardData);

export default router;
