import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import deliveriesRouter from './routes/deliveries.js';
import authRouter from './routes/auth.js';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { verifyToken } from './middleware/auth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyToken);

app.use('/auth', authRouter);
app.use('/api/deliveries', deliveriesRouter);

const register = new Registry();
collectDefaultMetrics({ register });
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log('Route-service DB connected');
    app.listen(PORT, () =>
      console.log(`Route-service listening on port ${PORT}`),
    );
  })
  .catch(err => console.error('Mongo connection error:', err));
