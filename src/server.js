import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { router } from './routers/contacts.js';
import { authRouter } from './routers/auth.js';
import { UPLOAD_DIR } from './constans/contacts.js';

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', router);
  app.use('/uploads', express.static(UPLOAD_DIR));

  app.use(notFoundHandler);

  app.use(errorHandler);
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(`${port}`, () => console.log(`Server is running on port ${port}`));
};
export default setupServer;
