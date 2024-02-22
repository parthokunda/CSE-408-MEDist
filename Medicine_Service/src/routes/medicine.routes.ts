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

// get selected generic details
medicineRouter.get(
  "/get_generic_info/:genericId",
  validateRequest(medicineSchema.get_generic_info_Schema),
  medicineController.get_generic_info
);

// get selected generic details v2
medicineRouter.get(
  "/get_generic_info/:genericId/:currentPage",
  validateRequest(medicineSchema.get_generic_info_Schema_v2),
  medicineController.get_generic_info_v2
);

// get selected manufacturer details
medicineRouter.get(
  "/get_manufacturer_info/:manufacturerId",
  validateRequest(medicineSchema.get_manufacturer_info_Schema),
  medicineController.get_manufacturer_info
);

// get selected manufacturer details v2
medicineRouter.get(
  "/get_manufacturer_info_v2/:manufacturerId/:currentPage",
  validateRequest(medicineSchema.get_manufacturer_info_v2_Schema),
  medicineController.get_manufacturer_info_v2
);

export default medicineRouter;
