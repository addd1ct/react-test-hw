import express from 'express';
import path from 'path';
import cors from 'cors';
import pino from 'pino-http';
import contactsRouter from './routers/contacts.routers.js';
import authRouter from './routers/auth.routers.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import dotenv from 'dotenv';
dotenv.config();

export function setupServer() {
  const app = express();

  app.use(cors());
  app.use(pino());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.use('/contacts', contactsRouter);
  app.use('/auth', authRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
