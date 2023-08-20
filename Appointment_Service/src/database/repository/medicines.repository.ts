//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import { Prescription_Medicines } from "../models";

export interface Prescription_Medicines_Repository_Interface {}

class Prescription_MedicinesRepository
  implements Prescription_Medicines_Repository_Interface {}

export default new Prescription_MedicinesRepository();
