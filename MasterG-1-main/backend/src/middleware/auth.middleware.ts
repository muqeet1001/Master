import { Request, Response, NextFunction } from "express";

/**
 * Lightweight authentication middleware.
 * 
 * Currently validates that userId and deviceId are present in
 * request headers. This is a foundation for proper auth — replace
 * with JWT/session-based auth for production.
 * 
 * Headers required:
 *   x-user-id: string (UUID format)
 *   x-device-id: string
 */

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const validateUser = (req: Request, res: Response, next: NextFunction) => {
  // Allow health check endpoints without auth
  if (req.path === "/" || req.path.endsWith("/health") || req.path.endsWith("/status")) {
    return next();
  }

  // Check userId from header or query params
  const userId = (req.headers["x-user-id"] as string) || (req.query.userId as string) || (req.body?.userId as string);

  if (!userId) {
    res.status(401).json({
      success: false,
      error: "Missing userId — provide x-user-id header or userId parameter",
    });
    return;
  }

  // Validate UUID format to prevent forged/guessed IDs
  if (!UUID_REGEX.test(userId)) {
    res.status(400).json({
      success: false,
      error: "Invalid userId format — must be a valid UUID",
    });
    return;
  }

  next();
};
