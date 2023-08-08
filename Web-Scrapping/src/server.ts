// internal imports
import log from "./utils/logger";

// database
import dbInit from "./database/init";
dbInit();

// scrapping
import start_scrapping from "./scrapping/allopathic_branc_scrapping/start_scrapping";
import start_scrapping_page_by_page from "./scrapping/allopathic_branc_scrapping/start_scrapping_page_by_page";

//start_scrapping(false);



// page by page done : 10 - 11

start_scrapping_page_by_page(10, 11, false);