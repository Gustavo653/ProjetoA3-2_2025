import { Router } from 'express';
import Driver from '../models/driver.js';
const router = Router();

router.get('/', async (_req, res) => res.json(await Driver.find()));
router.post('/', async (req, res) => res.status(201).json(await Driver.create(req.body)));
router.get('/:id', async (req, res) => res.json(await Driver.findById(req.params.id)));
router.put('/:id', async (req, res) => res.json(await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', async (req, res) => { await Driver.findByIdAndDelete(req.params.id); res.status(204).send(); });

export default router;
