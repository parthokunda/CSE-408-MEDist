// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import { Prescription } from "../database/models";

// repository instance
import { prescriptionRepository } from "../database/repository";

export interface PrescriptionServiceInterface {}

class PrescriptionService implements PrescriptionServiceInterface {}

export default new PrescriptionService();
