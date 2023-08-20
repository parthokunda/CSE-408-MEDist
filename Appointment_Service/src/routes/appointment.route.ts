//external imports
import express from "express";
import { Request, Response, NextFunction } from "express";
import {} from "../utils/custom.d";

// internal imports
import validateRequest from "./middleware/validateRequest";
import authorize from "./middleware/auth";

// schema instance
import appointmentSchema from "../schema/appointment.schema";

// controller instance
import appointmentController from "../controller/appointment.controller";

const appointmentRouter = express.Router();

// appointment home - accessible to all
appointmentRouter.get("/", authorize(false), (req: Request, res: Response) => {
  const id = req.user_identity?.id;
  const email = req.user_identity?.email;
  const role = req.user_identity?.role;

  res.status(200).json({
    id,
    email,
    role,
  });
});

// create appointment - only accessible to patient
appointmentRouter.post(
  "/book-online-appointment/:doctorID",
  authorize(true),
  validateRequest(appointmentSchema.Booking_Online_Appointment),
  appointmentController.Book_Online_Appointment
);

// search pending appointments - accessible to both patient and doctor
appointmentRouter.get(
  "/view-pending-appointments/:currentPage",
  authorize(false),
  validateRequest(appointmentSchema.Search_Pending_Appointments),
  appointmentController.View_Pending_Appointments
);

export default appointmentRouter;
