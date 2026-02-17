import { Request, Response, NextFunction } from "express";

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const stores: { [name: string]: RateLimitStore } = {};

/**
 * Simple in-memory rate limiter middleware.
 * For production, replace with express-rate-limit + Redis store.
 */
export function rateLimit(options: {
  windowMs: number;
  max: number;
  name: string;
  message?: string;
}) {
  const { windowMs, max, name, message } = options;

  if (!stores[name]) {
    stores[name] = {};
  }

  // Cleanup expired entries periodically
  setInterval(() => {
    const now = Date.now();
    const store = stores[name];
    for (const key of Object.keys(store)) {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    }
  }, windowMs);

  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const store = stores[name];

    if (!store[key] || store[key].resetTime < now) {
      store[key] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    store[key].count++;

    if (store[key].count > max) {
      res.status(429).json({
        success: false,
        error: message || "Too many requests, please try again later.",
      });
      return;
    }

    next();
  };
}

// Pre-configured rate limiters
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  name: "api-general",
  message: "Too many requests, please try again in a minute.",
});

export const uploadLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  name: "upload",
  message: "Too many uploads, please try again in a minute.",
});

export const queryLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  name: "query",
  message: "Too many queries, please try again in a minute.",
});

export const speechLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  name: "speech",
  message: "Too many transcription requests, please try again in a minute.",
});
