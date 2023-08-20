import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user_identity?: {
        id: number;
        email: string;
        role: string;
        profile_status: string;
      };

      file?: any;
    }
  }
}

export {};
