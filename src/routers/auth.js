import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { authRegisterSchema, authLoginSchema } from '../validation/auth.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  verifyController,
} from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

authRouter.get('/verify', ctrlWrapper(verifyController));

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));
