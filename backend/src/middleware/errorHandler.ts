import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);
  
  const status = (err as any).status || 500;
  const message = err.message || 'Internal server error';
  
  res.status(status).json({ error: message });
};