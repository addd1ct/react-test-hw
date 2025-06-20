import express from 'express';
import { registerController, loginUserController, refreshSessionController, logoutUserController } from '../controllers/auth.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema } from '../schemas/auth.schemas.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post('/logout', logoutUserController);

export default authRouter;
