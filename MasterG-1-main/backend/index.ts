import express, { Request, Response } from 'express';
import helmet from 'helmet';
const app = express();
app.use(helmet());
// ... other middleware and routes