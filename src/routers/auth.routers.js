import express from 'express';
import { registerController } from '../controllers/auth.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/auth.schemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerController);

export default authRouter;
