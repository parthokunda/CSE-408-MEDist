//external imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import {} from "../utils/custom.d";

// internal imports
import validateRequest from "./middleware/validateRequest";
import authorize from "./middleware/auth";

// schema instance
import AppointmentSchema from "../schema/appointment.schema";
const appointmentSchema = new AppointmentSchema();

// controller instance
import appointmentController from "../controller/appointment.controller";

const appointmentRouter = express.Router();

// appointment home - accessible to all
appointmentRouter.get(
  "/",
  authorize(false, false),
  (req: Request, res: Response) => {
    const id = req.user_identity?.id;
    const email = req.user_identity?.email;
    const role = req.user_identity?.role;

    res.status(200).json({
      id,
      email,
      role,
    });
  }
);

// create appointment - only accessible to patient
appointmentRouter.post(
  "/book-online-appointment/:scheduleID",
  authorize(true, false),
  validateRequest(appointmentSchema.Booking_Online_Appointment),
  appointmentController.Book_Online_Appointment
);

// confirm appointment - only accessible to patient
appointmentRouter.put(
  "/book-online-appointment/confirm/:appointmentID",
  authorize(true, false),
  validateRequest(appointmentSchema.Confirm_Online_Appointment),
  appointmentController.Confirm_Online_Appointment
);

// cancel appointment - only accessible to patient
appointmentRouter.delete(
  "/book-online-appointment/cancel/:appointmentID",
  authorize(true, false),
  validateRequest(appointmentSchema.Confirm_Online_Appointment),
  appointmentController.Cancel_Online_Appointment
);

// search appointments - accessible to both patient and doctor
appointmentRouter.get(
  "/view-appointments/:currentPage",
  authorize(false, false),
  validateRequest(appointmentSchema.Search_Pending_Appointments),
  appointmentController.Search_Appointments
);

//add other appointment - only accessible to patient
appointmentRouter.post(
  "/add-other-appointments/:appointmentID",
  authorize(true, false),
  validateRequest(appointmentSchema.Add_Other_Appointments),
  appointmentController.Add_Other_Appointments
);

//view appointment - accessible to both patient and doctor
appointmentRouter.get(
  "/view-appointment/:appointmentID",
  authorize(false, false),
  appointmentController.View_Appointment
);

export default appointmentRouter;
