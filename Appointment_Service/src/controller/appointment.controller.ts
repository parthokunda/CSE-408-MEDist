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
  day_startTime: Date;
  day_endTime: Date;
  totalSlots: number;
  timeInterval_forEachSlot: number;
  patientEmail: string;
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
  private setAppointmentDay(weekday: number): Date {
    const today = new Date().getDay();
    const appointmentDay = new Date();
    appointmentDay.setDate(
      appointmentDay.getDate() + (weekday - 2 - today) // -2 because weekday starts from 2
    );
    appointmentDay.setHours(0, 0, 0, 0);
    return appointmentDay;
  }

  private setAppointmentDayTime(appointmentDay: Date, time: string): Date {
    const appointmentDayTime = new Date(appointmentDay);
    appointmentDayTime.setHours(
      Number(time.split(":")[0]),
      Number(time.split(":")[1]),
      0,
      0
    );
    return appointmentDayTime;
  }

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
    const patientEmail = req.user_identity?.email;
    const weekday = Number(req.body.weekday);
    const startTime = req.body.startTime as string;
    const endTime = req.body.endTime as string;
    const totalSlots = Number(req.body.totalSlots);

    try {
      // check if week day is less than today
      const today = new Date().getDay();
      if (req.body.weekday < today)
        throw createHttpError(400, "You can't book appointment for past days");

      // construct appointmentDay from weekday
      const appointmentDay = this.setAppointmentDay(weekday);

      // construct appointment_day_start_time and appointment_day_end_time
      const appointment_day_start_time = this.setAppointmentDayTime(
        appointmentDay,
        startTime
      );

      const appointment_day_end_time = this.setAppointmentDayTime(
        appointmentDay,
        endTime
      );

      // construct time interval for each slot according to totalSlots and startTime & endTime
      const timeInterval_forEachSlot = Math.floor(
        (appointment_day_end_time.getTime() -
          appointment_day_start_time.getTime()) /
          req.body.totalSlots
      );

      // construct slotRequest
      const slotRequest: SlotRequest = {
        appointmentDay,
        day_startTime: appointment_day_start_time,
        day_endTime: appointment_day_end_time,
        totalSlots: req.body.totalSlots,
        timeInterval_forEachSlot,
        patientEmail: req.user_identity?.email || "",
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