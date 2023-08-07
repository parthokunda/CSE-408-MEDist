import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();

export const config = {
  PORT: process.env.PORT,
  DB: {
    NAME: process.env.DB_NAME as string,
    USER: process.env.DB_USER as string,
    HOST: process.env.DB_HOST,
    DRIVER: process.env.DB_DRIVER as Dialect,
    PASSWORD: process.env.DB_PASSWORD,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL as string,
  ENVIRONMENT: process.env.NODE_ENV,

  SELF_RPC_QUEUE: "AUTH_RPC",
  PATIENT_RPC_QUEUE: "PATIENT_RPC",
  DOCTOR_RPC_QUEUE: "DOCTOR_RPC",
};
