import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Driver from '../models/driver.js';
dotenv.config();

const router = Router();

router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  if (identifier === 'operator' && password === 'password') {
    const token = jwt.sign({ sub: 'operator', role: 'operator' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    return res.json({ token, role: 'operator' });
  }

  const driver = await Driver.findOne({ $or: [{ cpf: identifier }, { registrationNumber: identifier }] });
  if (!driver || password !== driver.password) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ sub: driver._id.toString(), role: 'driver' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token, role: 'driver', userId: driver._id.toString() });
});

router.post('/register', async (req, res) => {
  const { name, licenseNumber, cpf, registrationNumber, phone, password } = req.body;
  if (!name || !licenseNumber || !password) {
    return res.status(400).json({ message: 'Campos obrigatórios ausentes' });
  }

  const exists = await Driver.findOne({
    $or: [{ cpf }, { registrationNumber }, { licenseNumber }],
  });
  if (exists) {
    return res.status(409).json({ message: 'Motorista já cadastrado' });
  }

  const driver = await Driver.create({ name, licenseNumber, cpf, registrationNumber, phone, password });
  const token = jwt.sign({ sub: driver._id.toString(), role: 'driver' }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.status(201).json({ token, role: 'driver', userId: driver._id.toString() });
});

export default router;