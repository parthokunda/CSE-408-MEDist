import dotenv from "dotenv";
import { Dialect } from "sequelize";

dotenv.config();
const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

export const config = {
  PORT: process.env.PORT,
  DB: {
    URL: `postgres://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?options=project%3D${ENDPOINT_ID}`,
  },
  JWT_SECRET: process.env.JWT_SECRET,
  MSG_QUEUE_URL: process.env.MSG_QUEUE_URL as string,
  ENVIRONMENT: process.env.NODE_ENV,

  SELF_RPC_QUEUE: "PATIENT_RPC",
  AUTH_RPC_QUEUE: "AUTH_RPC",

  FIREBASE_CONFIG: {
    apiKey: "AIzaSyCHZ4fFHB6mG2e1QfU8njqeZnbhmRnO9Go",
    authDomain: "medist-photos-8c6bf.firebaseapp.com",
    projectId: "medist-photos-8c6bf",
    storageBucket: "medist-photos-8c6bf.appspot.com",
    messagingSenderId: "488575338890",
    appId: "1:488575338890:web:af4e96b6e455fcf9296073",
    measurementId: "G-QB6RHMBMMK",
  },
};
