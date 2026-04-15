import express, { Application } from 'express';
import { securityMiddleware } from './middleware/security.middleware';
const app: Application = express();
app.use(securityMiddleware);