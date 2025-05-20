
import { Router } from 'express';
import Delivery from '../models/delivery.js';
import { publishDeliveryCreated } from '../rabbitmq.js';

const router = Router();

router.get('/', async (req, res) => {
  const { status } = req.query;
  const filter:any = status ? { status } : {};
  res.json(await Delivery.find(filter));
});

router.get('/next/:driverId', async (req, res) => {
  const d = await Delivery.findOne({ driverId: req.params.driverId, status: { $ne: 'delivered' } }).sort({ createdAt: 1 });
  res.json(d);
});

router.post('/', async (req, res) => {
  const delivery = await Delivery.create(req.body);
  await publishDeliveryCreated(delivery);
  res.status(201).json(delivery);
});

router.put('/:id', async (req, res) => res.json(await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true })));

router.put('/:id/status', async (req,res)=>{
  const { status } = req.body;
  res.json(await Delivery.findByIdAndUpdate(req.params.id,{status},{new:true}));
});

router.delete('/:id', async (req, res) => { await Delivery.findByIdAndDelete(req.params.id); res.status(204).send(); });

export default router;
