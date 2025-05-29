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