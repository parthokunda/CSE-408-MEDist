//external imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import {} from "../utils/custom.d";

// internal imports
import validateRequest from "./middleware/validateRequest";
import authorize from "./middleware/auth";

// schema instance
import doctorSchema from "../schema/doctor.schema";

// controller instance
import doctorController from "../controller/doctor.controller";

const doctorRouter = express.Router();

// doctor home - only accessible to doctor
doctorRouter.get("/", authorize, (req: Request, res: Response) => {
  const id = req.user_identity?.id;
  const email = req.user_identity?.email;
  const role = req.user_identity?.role;

  res.status(200).json({
    id,
    email,
    role,
  });
});

// get Specialization list - accessible to all
doctorRouter.get(
  "/specialization-list",
  authorize(false),
  doctorController.getSpecializationList
);

// get doctor's additional info - only accessible to doctor
doctorRouter.get(
  "/additional-info",
  authorize,
  doctorController.getDoctorAdditionalInfo
);

// update doctor's additional info - only accessible to doctor
doctorRouter.put(
  "/additional-info",
  authorize,
  validateRequest(doctorSchema.Update_Doctor_Info),
  doctorController.updateDoctorAdditionalInfo
);

// create online schedule - only accessible to doctor
doctorRouter.post(
  "/online-visit",
  authorize,
  validateRequest(doctorSchema.Create_Schedule),
  doctorController.createOnlineSchedule
);

// update online schedule - only accessible to doctor
doctorRouter.put(
  "/online-visit",
  authorize,
  validateRequest(doctorSchema.Create_Schedule),
  doctorController.updateOnlineSchedule
);

// get doctor's profile info - accessible to doctor
doctorRouter.get(
  "/profile-info",
  authorize,
  doctorController.getDoctorProfileInfo
);

// get doctor's profile info - accessible to all
doctorRouter.get(
  "/profile-info/:doctorID",
  authorize(false),
  doctorController.getDoctorProfileInfo_givenID
);

// search doctor - accessible to all
doctorRouter.get(
  "/search/:currentPage",
  authorize(false),
  validateRequest(doctorSchema.Search_Doctor),
  doctorController.searchDoctor
);

export default doctorRouter;
