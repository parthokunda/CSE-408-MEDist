// external imports
import { NextFunction, Request, Response } from "express";
import {} from "../utils/custom";

// service instances
import {
  appointmentService,
  prescriptionService,
  prescription_medicineService,
} from "../services";
import {
  Booking_Online_Appointment_Body_Input,
  Booking_Online_Appointment_Params_Input,
} from "../schema/appointment.schema";
import createHttpError from "http-errors";
import log from "../utils/logger";

export interface SlotRequest {
  appointmentDay: Date;
  startTime: Date;
  endTime: Date;
  totalSlots: number;
  timeInterval: number;
  patientEmail?: string;
}

export interface Appointment_Controller_Interface {
  //book online appointment - by patient
  Book_Online_Appointment(
    req: Request /* <
      Booking_Online_Appointment_Params_Input,
      {},
      Booking_Online_Appointment_Body_Input
    > */,
    res: Response,
    next: NextFunction
  );
}

class Appointment_Controller implements Appointment_Controller_Interface {
  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    req: Request /* <
      Booking_Online_Appointment_Params_Input,
      {},
      Booking_Online_Appointment_Body_Input
    >*/,
    res: Response,
    next: NextFunction
  ) {
    const doctorID = Number(req.params.doctorID);
    const patientID = Number(req.user_identity?.id);

    try {
      // check if week day is less than today
      const today = new Date().getDay();
      if (req.body.weekday < today)
        throw createHttpError(400, "You can't book appointment for past days");

      // construct appointmentDay from weekday
      const appointmentDay = new Date();

      log.info(appointmentDay.getDay(), "current day");

      // set appointmentDay according to weekday
      appointmentDay.setDate(
        appointmentDay.getDate() + (req.body.weekday - 2 - today) // -2 because weekday starts from 2
      );
      appointmentDay.setHours(0, 0, 0, 0);

      log.info(appointmentDay.getDay(), "appointmentDay");

      // construct appointment_day_start_time and appointment_day_end_time
      const appointment_day_start_time = new Date(appointmentDay);
      appointment_day_start_time.setHours(
        Number(req.body.startTime.split(":")[0]),
        Number(req.body.startTime.split(":")[1]),
        0,
        0
      );

      log.info(
        `${appointment_day_start_time.getHours()}:${appointment_day_start_time.getMinutes()}`,
        "appointment_day_start_time"
      );

      const appointment_day_end_time = new Date(appointmentDay);
      appointment_day_end_time.setHours(
        Number(req.body.endTime.split(":")[0]),
        Number(req.body.endTime.split(":")[1]),
        0,
        0
      );

      log.info(
        `${appointment_day_end_time.getHours()}:${appointment_day_end_time.getMinutes()}`,
        "appointment_day_end_time"
      );

      // construct time interval for each slot according to totalSlots and startTime & endTime
      // this difference is in milliseconds
      const timeInterval = Math.floor(
        (appointment_day_end_time.getTime() -
          appointment_day_start_time.getTime()) /
          req.body.totalSlots
      );

      log.info(timeInterval, "timeInterval");

      // construct slotRequest
      const slotRequest: SlotRequest = {
        appointmentDay,
        startTime: appointment_day_start_time,
        endTime: appointment_day_end_time,
        totalSlots: req.body.totalSlots,
        timeInterval: timeInterval,
        patientEmail: req.user_identity?.email,
      };

      // book online appointment
      const appointment = await appointmentService.Book_Online_Appointment(
        doctorID,
        patientID,
        slotRequest
      );

      // send response
      res.status(200).json({
        message: "Appointment booked successfully",
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new Appointment_Controller();
