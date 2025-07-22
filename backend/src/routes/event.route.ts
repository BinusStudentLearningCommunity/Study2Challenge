import express, { RequestHandler } from 'express';
import { authenticationToken } from '../middleware/auth.middleware';
import { registerForEvent, joinTeam } from '../controllers/event.controller';

const router = express.Router();

router.post('/register', authenticationToken, registerForEvent as RequestHandler);
router.post('/join', authenticationToken, joinTeam as RequestHandler);

export default router;
