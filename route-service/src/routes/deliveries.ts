import { Router } from 'express';
import Delivery from '../models/delivery.js';
import { publishDeliveryCreated } from '../rabbitmq.js';

const router = Router();

// list
router.get('/', async (_req, res) => res.json(await Delivery.find()));
// create
router.post('/', async (req, res) => {
  const delivery = await Delivery.create(req.body);
  await publishDeliveryCreated(delivery);
  res.status(201).json(delivery);
});
// read
router.get('/:id', async (req, res) => res.json(await Delivery.findById(req.params.id)));
// update
router.put('/:id', async (req, res) => res.json(await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true })));
// delete
router.delete('/:id', async (req, res) => { await Delivery.findByIdAndDelete(req.params.id); res.status(204).send(); });

export default router;
