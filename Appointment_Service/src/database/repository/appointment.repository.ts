//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import { Appointment } from "../models";

export interface Appointment_Repository_Interface {}

class AppointmentRepository implements Appointment_Repository_Interface {}

export default new AppointmentRepository();
