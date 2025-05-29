import { Router } from 'express';
import Truck from '../models/truck.js';
import { requireRole } from '../middleware/roles.js';

const router = Router();

router.get('/', requireRole('operator'), async (_req, res) => res.json(await Truck.find()));
router.post('/', requireRole('operator'), async (req, res) => res.status(201).json(await Truck.create(req.body)));
router.get('/:id', requireRole('operator'), async (req, res) => res.json(await Truck.findById(req.params.id)));
router.put('/:id', requireRole('operator'), async (req, res) => res.json(await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', requireRole('operator'), async (req, res) => { await Truck.findByIdAndDelete(req.params.id); res.status(204).send(); });

export default router;