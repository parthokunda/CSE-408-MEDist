//internal imports
import log from "../utils/logger";
import { config } from "../config";


// import all models
import User from "./models/User.model";


const isDev = config.ENVIRONMENT === "development";

const dbInit = async () =>
  Promise.all([
    // sync all models with database
    User.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default dbInit;
