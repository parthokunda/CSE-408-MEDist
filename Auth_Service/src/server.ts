//external imports
import express from "express";
import cors from "cors";

//internal imports
import log from "./utils/logger";
import { config } from "./config";
import router from "./routes/index";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

// database
import dbInit from "./database/init";
dbInit();

// message broker
import messageBroker from "./utils/broker";
import userService from "./services/user.service";
messageBroker.RPC_Observer(userService);

const app = express();

// pre-route middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));


// routes
app.use(router);

// 404 error handler
app.use(notFoundHandler);

// default error handler
app.use(defaultErrorHandler);

const PORT = config.PORT;

app.listen(PORT, () => {
  log.info(`Server running at http://localhost:${PORT}`);
});
