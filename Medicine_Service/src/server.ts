//external imports
import express from "express";

// internal imports
import log from "./utils/logger";
import router from './routes'
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

// database
import dbInit from "./database/init";
dbInit();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(router);

// 404 error handler
app.use(notFoundHandler);

// default error handler
app.use(defaultErrorHandler);

const port = process.env.PORT || 3000;

app.listen(port, () => { 
    log.info(`Server running at http://localhost:${port}`);
});





