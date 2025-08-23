// File: src/routes/event.route.ts

import express, { RequestHandler } from 'express';
import { authenticationToken } from '../middleware/auth.middleware';
import { registerForEvent, joinTeam, getMyTeam } from '../controllers/event.controller';
import upload from '../middleware/upload.middleware';

const router = express.Router();
const jsonParser = express.json(); // Create a local JSON parser instance

// This route uses multer, which is its own body parser. NO jsonParser here.
router.post('/register',
    authenticationToken,
    upload.fields([
        { name: 'creatorIdCard', maxCount: 1 },
        { name: 'memberIdCards', maxCount: 2 },
        { name: 'paymentProof', maxCount: 1 }
    ]),
    registerForEvent as RequestHandler
);

// This route handles JSON, so we add the jsonParser middleware here.
router.post('/join', authenticationToken, jsonParser, joinTeam as RequestHandler);

// This route does not have a body, so no parser is needed.
router.get('/mine', authenticationToken, getMyTeam as RequestHandler); 

export default router;