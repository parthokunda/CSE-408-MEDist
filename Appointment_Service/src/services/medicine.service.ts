// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import { Prescription_Medicines } from "../database/models";

// repository instance
import { prescription_medicinesRepository } from "../database/repository";

export interface Prescription_Medicines_ServiceInterface {}

class Prescription_Medicines_Service
  implements Prescription_Medicines_ServiceInterface {}

export default new Prescription_Medicines_Service();
