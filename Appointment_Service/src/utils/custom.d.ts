import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user_identity?: {
        id: number;
        email: string;
        role: string;
      };

      file?: any;
    }
  }
}

export {};
