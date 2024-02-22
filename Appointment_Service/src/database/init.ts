//internal imports
import log from "../utils/logger";
import { config } from "../config";

// import all models
import Appointment from "./models/Appointment.model";
import Prescription from "./models/Prescription.model";
import Prescription_Medicines from "./models/Prescription_Medicines.model";
import deleteTempApp from "./models/deleteTempApp";

const isDev = config.ENVIRONMENT === "development";

const dbInit = async () =>
  Promise.all([
    // sync all models with database
    Appointment.sync({ alter: isDev }),
    Prescription.sync({ alter: isDev }),
    Prescription_Medicines.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

deleteTempApp.start();

export default dbInit;
