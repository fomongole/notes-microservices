import { Router } from 'express';
import { createInternalUser } from '../controllers/user.controller';

const router = Router();

// Endpoint: POST /internal/users
// Description: Receives { _id, email, username } from Auth Service
router.post('/users', createInternalUser);

export default router;