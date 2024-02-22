import dotenv from "dotenv";
import { Dialect } from "sequelize";

if (process.env.NODE_ENV !== "prod") {
  const configFile = `./.env.local`;
  dotenv.config({ path: configFile });
} else {
  dotenv.config();
}
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export const config = {
  PORT: process.env.PORT,
  DB: {
    URL: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}`,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL as string,
  ENVIRONMENT: process.env.NODE_ENV,
  CREDENTIALS: JSON.parse(process.env.CREDENTIALS),

  SELF_RPC_QUEUE: "AUTH_RPC",
  PATIENT_RPC_QUEUE: "PATIENT_RPC",
  DOCTOR_RPC_QUEUE: "DOCTOR_RPC",
};
