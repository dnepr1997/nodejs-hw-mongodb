import { readFileSync } from 'node:fs';
import { SWAGGER_PATH } from '../constans/index.js';
import swaggerUI from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    const swaggerDoc = JSON.parse(readFileSync(SWAGGER_PATH).toString());
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    return (req, res) => {
      res.status(500).join({
        message: "Can't load swagger docs",
      });
    };
  }
};
