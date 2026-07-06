import type { SessionUser } from "../lib/auth.js";

declare global {
  namespace Express {
    interface Request {
      ccwebaiSession?: SessionUser | null;
    }
  }
}

export {};
