import express from 'express';
import { authenticationToken } from '../middleware/auth.middleware';
import { registerForEvent } from '../controllers/event.controller';

const router = express.Router();

router.post('/register', authenticationToken, registerForEvent);

export default router;
