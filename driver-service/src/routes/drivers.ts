import { Router } from 'express';
import Driver from '../models/driver.js';
import { getPendingDeliveries } from '../rabbitmq.js';
import { requireRole, requireSelfOrRole } from '../middleware/roles.js';

const router = Router();

router.get('/', requireRole('operator'), async (_req, res) => res.json(await Driver.find()));
router.post('/', requireRole('operator'), async (req, res) => res.status(201).json(await Driver.create(req.body)));
router.get('/:id', requireRole('operator'), async (req, res) => res.json(await Driver.findById(req.params.id)));
router.put('/:id', requireRole('operator'), async (req, res) => res.json(await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', requireRole('operator'), async (req, res) => { await Driver.findByIdAndDelete(req.params.id); res.status(204).send(); });

router.get('/:id/pending-deliveries',
  requireSelfOrRole('id', 'operator'),
  async (req, res) => {
    const deliveries = await getPendingDeliveries(req.params.id);
    res.json(deliveries);
  },
);

export default router;
