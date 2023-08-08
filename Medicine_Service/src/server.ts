//external imports
import express from "express";
import cors from "cors";

// internal imports
import log from "./utils/logger";
import router from "./routes/index";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";
import { config } from "./config";


// database
import dbInit from "./database/init";
dbInit();

const app = express();
app.use(cors());

// pre-route middlewares
app.use(express.json());
app.use(cors());


app.use(router);

// 404 error handler
app.use(notFoundHandler);

// default error handler
app.use(defaultErrorHandler);



app.listen(config.PORT, () => {
  log.info(`Server running at http://localhost:${config.PORT}`);
});
