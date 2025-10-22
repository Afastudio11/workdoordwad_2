import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

// Store CSRF tokens per session
const csrfTokens = new Map<string, { token: string; expires: number }>();

// Generate secure random token
export function generateCsrfToken(sessionId: string): string {
  const token = crypto.randomBytes(32).toString("hex");
  const expires = Date.now() + (1000 * 60 * 60); // 1 hour
  
  csrfTokens.set(sessionId, { token, expires });
  
  // Cleanup old tokens periodically
  if (Math.random() < 0.01) {
    const now = Date.now();
    for (const [sid, data] of csrfTokens.entries()) {
      if (data.expires < now) {
        csrfTokens.delete(sid);
      }
    }
  }
  
  return token;
}

// Validate CSRF token
export function validateCsrfToken(sessionId: string, token: string): boolean {
  const stored = csrfTokens.get(sessionId);
  
  if (!stored) {
    return false;
  }
  
  if (stored.expires < Date.now()) {
    csrfTokens.delete(sessionId);
    return false;
  }
  
  return crypto.timingSafeEqual(
    Buffer.from(stored.token),
    Buffer.from(token)
  );
}

// Middleware for CSRF protection
export function csrfProtection(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-csrf-token"] as string || req.body._csrf;
  const sessionId = req.sessionID;
  
  if (!sessionId) {
    return res.status(403).json({ error: "No session found" });
  }
  
  if (!token) {
    return res.status(403).json({ error: "CSRF token missing" });
  }
  
  if (!validateCsrfToken(sessionId, token)) {
    return res.status(403).json({ error: "Invalid CSRF token" });
  }
  
  next();
}

// Middleware to attach CSRF token to response
export function attachCsrfToken(req: Request, res: Response, next: NextFunction) {
  if (req.sessionID) {
    const token = generateCsrfToken(req.sessionID);
    res.locals.csrfToken = token;
  }
  next();
}
