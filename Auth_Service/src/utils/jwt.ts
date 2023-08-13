// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// internal imports
import { config } from "../config";

export interface JWT_Payload {
  id: number;
  email: string;
  role: string;
  profile_status: string;
}

export interface JWT_Service_Interface {
  generateSalt(): Promise<string>;

  generatePasswordHash(
    email: string,
    password: string,
    salt: string
  ): Promise<string>;

  validatePassword(
    email: string,
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ): Promise<boolean>;

  generateToken(payload: JWT_Payload): Promise<string>;

  verifyToken(token: string): Promise<JWT_Payload>;
}

class JWT_Service implements JWT_Service_Interface {
  constructor() {}

  async generateSalt(): Promise<string> {
    return await bcrypt.genSalt();
  }

  async generatePasswordHash(
    email: string,
    password: string,
    salt: string
  ): Promise<string> {
    const tempPassword = `${email}${password}`;
    return await bcrypt.hash(tempPassword, salt);
  }

  async validatePassword(
    email: string,
    enteredPassword: string,
    savedPassword: string,
    salt: string
  ): Promise<boolean> {
    return (
      (await this.generatePasswordHash(email, enteredPassword, salt)) ===
      savedPassword
    );
  }

  async generateToken(payload: JWT_Payload): Promise<string> {
    return await jwt.sign(payload, config.JWT_SECRET as string, {
      expiresIn: "1d",
    });
  }

  async verifyToken(token: string): Promise<JWT_Payload> {
    return (await jwt.verify(
      token,
      config.JWT_SECRET as string
    )) as JWT_Payload;
  }
}

export default new JWT_Service();
