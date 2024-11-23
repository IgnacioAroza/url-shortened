import { NextFunction, Request, Response } from 'express';
import { UserRepository } from '../../domain/repositories/UserRepository';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authMiddleware = (userRespository: UserRepository) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        throw new Error();
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string };
      const user = await userRespository.findById(decoded.id);

      if (!user) {
        throw new Error();
      }

      req.user = { id: user.id };
      next();
    } catch (error) {
      res.status(401).json({ error: 'Please authenticate yourself' });
    }
  }
}