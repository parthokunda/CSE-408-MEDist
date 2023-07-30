//external imports
import express from "express";

// internal imports
import validateRequest from "../middleware/validateRequest";
import medicineSchema from "../schema/medicine.schema";
import medicineController from "../controller/medicine.controller";

const medicineRouter = express.Router();

medicineRouter.get(
  "/get_all_medicines/:currentPage",
  validateRequest(medicineSchema.search_All_Medicine_Schema),
  medicineController.search_all_medicines
);

medicineRouter.get(
  "/get_all_medicines",
  validateRequest(medicineSchema.search_All_Medicine_Schema),
  medicineController.search_all_medicines
);

// get selected medicine details
medicineRouter.get(
  "/get_medicine_info/:medicineId",
  validateRequest(medicineSchema.get_medicine_info_Schema),
  medicineController.get_medicine_info
);

export default medicineRouter;
