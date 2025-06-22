import express from 'express';
import { registerController, loginUserController, refreshSessionController, logoutUserController, sendResetEmailController } from '../controllers/auth.controllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema, loginSchema, resetEmailSchema } from '../schemas/auth.schemas.js';
import { resetPasswordSchema } from '../schemas/auth.schemas.js';
import { resetPasswordController } from '../controllers/auth.controllers.js';

const authRouter = express.Router();

authRouter.post('/register', validateBody(registerSchema), registerController);
authRouter.post('/login', validateBody(loginSchema), loginUserController);
authRouter.post('/refresh', refreshSessionController);
authRouter.post('/logout', logoutUserController);
authRouter.post('/send-reset-email', validateBody(resetEmailSchema), sendResetEmailController);
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), resetPasswordController);

export default authRouter;
