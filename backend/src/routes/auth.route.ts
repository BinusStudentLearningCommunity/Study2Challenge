import express, { RequestHandler } from 'express';
import { login } from '../controllers/auth.login';
import { register } from '../controllers/auth.register';  

const router = express.Router();

router.post('/login', login as RequestHandler);
router.post('/register', register as RequestHandler);  

export default router;
