require("dotenv").config();

import log from "../utils/logger";


// import all models
import Generic from "./models/Generic.model";
import Brand from "./models/Brand.model";
import DosageForm from "./models/DosageForm.model";
import Manufacturer from "./models/Manufacturer.model";
import Description from "./models/Description.model";

const isDev = process.env.NODE_ENV === "development";



const dbInit = async () =>
  Promise.all([
    Generic.sync({ alter: isDev }),
    DosageForm.sync({ alter: isDev }),
    Manufacturer.sync({ alter: isDev }),
    Description.sync({ alter: isDev }),
    Brand.sync({ alter: isDev }),
  ])
    .then(() => {
      log.info("Database synced.");
    })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default dbInit;
