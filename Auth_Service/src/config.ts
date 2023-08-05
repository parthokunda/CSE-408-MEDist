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
  EXCHANGE_NAME: process.env.EXCHANGE_NAME as string,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL as string,
  ENVIRONMENT: process.env.NODE_ENV,
  AUTH_SERVICE: "auth_service",

  AUTH_RPC_QUEUE: "auth_rpc_queue",
  PATIENT_RPC_QUEUE: "patient_rpc_queue",
};
