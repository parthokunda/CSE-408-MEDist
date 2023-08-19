//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import { Prescription } from "../models";

export interface Prescription_Repository_Interface {}

class PrescriptionRepository implements Prescription_Repository_Interface {}

export default new PrescriptionRepository();
