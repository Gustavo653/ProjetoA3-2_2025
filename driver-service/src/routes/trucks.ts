import { Router } from 'express';
import Truck from '../models/truck.js';
const router = Router();

router.get('/', async (_req, res) => res.json(await Truck.find()));
router.post('/', async (req, res) => res.status(201).json(await Truck.create(req.body)));
router.get('/:id', async (req, res) => res.json(await Truck.findById(req.params.id)));
router.put('/:id', async (req, res) => res.json(await Truck.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', async (req, res) => { await Truck.findByIdAndDelete(req.params.id); res.status(204).send(); });

export default router;
