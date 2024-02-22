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
  FIREBASE_CONFIG: {
    apiKey: "AIzaSyCHZ4fFHB6mG2e1QfU8njqeZnbhmRnO9Go",
    authDomain: "medist-photos-8c6bf.firebaseapp.com",
    projectId: "medist-photos-8c6bf",
    storageBucket: "medist-photos-8c6bf.appspot.com",
    messagingSenderId: "488575338890",
    appId: "1:488575338890:web:74cac2aba18611d2296073",
    measurementId: "G-11DL9TJF5L",
  },

  SELF_RPC_QUEUE: "APPOINTMENT_RPC",

  AUTH_RPC_QUEUE: "AUTH_RPC",
  PATIENT_RPC_QUEUE: "PATIENT_RPC",
  DOCTOR_RPC_QUEUE: "DOCTOR_RPC",
  MEDICINE_RPC_QUEUE: "MEDICINE_RPC",

  APPOINTMENT_CREATION_EXCHANGE: "APPOINTMENT_CREATION",
  TEMPORARAY_APPOINTMENT_DELETION_EXCHANGE: "TEMPORARAY_APPOINTMENT_DELETION",
};
