// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import { Appointment } from "../database/models";

// repository instance
import { appointmentRepository } from "../database/repository";

export interface AppointmentServiceInterface {}

class AppointmentService implements AppointmentServiceInterface {}

export default new AppointmentService();
