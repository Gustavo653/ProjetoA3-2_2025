import { Router } from 'express';
import Delivery from '../models/delivery.js';
import { publishEvent } from '../rabbitmq.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

const allowedTransitions: Record<string, string[]> = {
  pending: ['en_route'],
  en_route: ['delivered'],
  delivered: [],
};

router.get('/', async (req, res) => {
  const filter = req.query.status ? { status: req.query.status } : {};
  res.json(await Delivery.find(filter));
});

router.get('/next/:driverId', async (req, res) => {
  const d = await Delivery.findOne({
    driverId: req.params.driverId,
    status: { $ne: 'delivered' },
  }).sort({ createdAt: 1 });
  res.json(d);
});

router.get('/:id', async (req, res) => {
  res.json(await Delivery.findById(req.params.id));
});

router.post('/', requireRole('operator'), async (req, res) => {
  const delivery = await Delivery.create(req.body);
  await publishEvent('delivery.created', delivery);
  res.status(201).json(delivery);
});

router.put('/:id', requireRole('operator'), async (req, res) => {
  res.json(await Delivery.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

router.put('/:id/status', async (req, res) => {
  const { status } = req.body;
  const delivery = await Delivery.findById(req.params.id);
  if (!delivery) return res.status(404).json({ message: 'Entrega não encontrada' });

  if (!allowedTransitions[delivery.status].includes(status)) {
    return res.status(400).json({
      message: `Transição inválida: ${delivery.status} ➜ ${status}`,
      allowedNext: allowedTransitions[delivery.status],
    });
  }

  delivery.status = status;
  await delivery.save();
  await publishEvent('delivery.statusUpdated', delivery);
  res.json(delivery);
});

router.delete('/:id', requireRole('operator'), async (req, res) => {
  await Delivery.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

export default router;