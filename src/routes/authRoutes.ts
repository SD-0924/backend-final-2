import { Router } from 'express';
import { signUp, login } from '../controllers/authController';

const router = Router();

// Define the routes
router.post('/signup', signUp);
router.post('/login', login);

export default router;
