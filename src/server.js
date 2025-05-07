import express from 'express';
import cors from 'cors';
// import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import { router } from './routers/contacts.js';
import { authRouter } from './routers/auth.js';

dotenv.config();

const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // app.use(logger);

  app.use('/auth', authRouter);
  app.use('/contacts', router);

  app.use(notFoundHandler);

  app.use(errorHandler);
  const port = Number(getEnvVar('PORT', 3000));
  app.listen(`${port}`, () => console.log(`Server is running on port ${port}`));
};
export default setupServer;
