// external imports
import express from "express";
import cors from "cors";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
dotenv.config();

// internal imports
import log from "./utils/logger";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function middlewares(req, res, next) {
  log.info(req.body, "request body");
  log.info(req, "request");
  next();
}
app.use("/api/auth", middlewares, proxy("http://localhost:3001"));
app.use("/api/medicine", middlewares, proxy("http://localhost:3002"));
app.use("/api/patient", middlewares, proxy("http://localhost:3003"));

app.use(notFoundHandler);
app.use(defaultErrorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  log.info(`Server running at http://localhost:${PORT}`);
});
