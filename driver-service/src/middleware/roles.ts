import { Request, Response, NextFunction } from 'express';

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Permissão negada' });
    }
    next();
  };
}

export function requireSelfOrRole(param: string, ...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
      return res.status(403).json({ message: 'Permissão negada' });
    }
    const isSelf = req.params[param] === user.sub;
    const hasRole = roles.includes(user.role);
    if (!isSelf && !hasRole) {
      return res.status(403).json({ message: 'Permissão negada' });
    }
    next();
  };
}