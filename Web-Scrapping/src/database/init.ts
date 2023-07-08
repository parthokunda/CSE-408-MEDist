require("dotenv").config();

import log from "../utils/logger";

//import { User, Session } from "./models";

const isDev = process.env.NODE_ENV === "development";

const dbInit = () =>
  Promise.all([/* User.sync({ alter: isDev }) */])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default dbInit;
