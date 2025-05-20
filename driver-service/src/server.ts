import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import driversRouter from './routes/drivers.js';
import trucksRouter from './routes/trucks.js';
import authRouter from './routes/auth.js';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { verifyToken } from './middleware/auth.js';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(verifyToken);

app.use('/auth', authRouter);
app.use('/api/drivers', driversRouter);
app.use('/api/trucks', trucksRouter);

const register = new Registry();
collectDefaultMetrics({ register });
app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const PORT = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URL!)
  .then(() => {
    console.log('Driver DB connected');
    app.listen(PORT, () => console.log(`Driver service listening on ${PORT}`));
  })
  .catch(err => console.error(err));
