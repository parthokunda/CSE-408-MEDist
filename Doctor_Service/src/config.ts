import dotenv from "dotenv";
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
    URL: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE},`,
  },
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL as string,
  ENVIRONMENT: process.env.NODE_ENV,

  SELF_RPC_QUEUE: "DOCTOR_RPC",
  AUTH_RPC_QUEUE: "AUTH_RPC",
  PATIENT_RPC_QUEUE: "PATIENT_RPC",

  APPOINTMENT_CREATION_EXCHANGE: "APPOINTMENT_CREATION",
  TEMPORARAY_APPOINTMENT_DELETION_EXCHANGE: "TEMPORARAY_APPOINTMENT_DELETION",
};
