import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Unauthorized: Token missing or invalid.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    // Using simple explicit checking because undefined typescript types check handles
    const secret = process.env.JWT_ACCESS_SECRET || 'fallback-secret-123';
    
    const payload = jwt.verify(token, secret) as { id: string, email: string };
    
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Token expired or invalid.' });
  }
};
