// internal imports
import log from "./utils/logger";

// database
import dbInit from "./database/init";
dbInit();


// scrapping
import start_scrapping from "./scrapping/allopathic_branc_scrapping/start_scrapping";

//start_scrapping(true);