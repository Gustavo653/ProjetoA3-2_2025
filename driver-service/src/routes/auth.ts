import { Router } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const demoUser = { id: 1, username: 'admin', password: 'password' };

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username !== demoUser.username || password !== demoUser.password) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }
  const token = jwt.sign({ sub: demoUser.id, username }, process.env.JWT_SECRET!, { expiresIn: '1d' });
  res.json({ token });
});

export default router;
