//external imports
import express from "express";
import cors from "cors";

//internal imports
import log from "./utils/logger";
import { notFoundHandler, defaultErrorHandler } from "./utils/error-handler";

// database
import dbInit from "./database/init";
dbInit();

// message broker
import brokerService from "./utils/broker";
const channel = brokerService.createChannel();
