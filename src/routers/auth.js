import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  authRegisterSchema,
  authLoginSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

// const router = Router();

// router.post(
//   '/register',
//   validateBody(authRegisterSchema),
//   ctrlWrapper(registerController),
// );

// router.post(
//   '/login',
//   validateBody(authLoginSchema),
//   ctrlWrapper(loginController),
// );

// router.post('/refresh', ctrlWrapper(refreshController));

// router.post('/logout', ctrlWrapper(logoutController));
// //

// router.post(
//   '/send-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// router.post(
//   '/reset-pwd',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );
// export default router;
const router = Router();

router.post(
  '/register',
  validateBody(authRegisterSchema),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(authLoginSchema),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshController));

router.post('/logout', ctrlWrapper(logoutController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

export default router;
