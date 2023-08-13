import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user_identity?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
