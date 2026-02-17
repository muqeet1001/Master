import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  details?: string;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    details: err.details || undefined,
  });
};

/**
 * asyncHandler utility for wrapping async route handlers.
 * 
 * Note: Express 5 natively handles async errors, so this wrapper
 * is only needed for backward compatibility. It can be safely removed
 * once the codebase is fully migrated to Express 5 patterns.
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
