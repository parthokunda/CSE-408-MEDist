//internal imports
import log from "../utils/logger";
import { config } from "../config";
import Specialization from "./models/Specialization.model";
import Doctor from "./models/Doctor.model";

// import all models

const isDev = config.ENVIRONMENT === "development";

const dbInit = async () =>
  Promise.all([
    // sync all models with database
    Specialization.sync({ alter: isDev }),
    Doctor.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default dbInit;
