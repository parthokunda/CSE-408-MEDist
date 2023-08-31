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
  Booking_Online_Appointment_Params_Input,
  Confirm_Online_Appointment_Params_Input,
} from "../schema/appointment.schema";
import createHttpError from "http-errors";
import log from "../utils/logger";
import { Search_Appointment_Input } from "../database/repository";
import {
  AppointmentStatus,
  AppointmentTimeSlot,
  AppointmentType,
  WeekName,
} from "../database/models";

export interface SlotRequest {
  appointmentDay: Date;
  day_startTime: Date;
  day_endTime: Date;
  totalSlots: number;
  timeInterval_forEachSlot: number;
  patientEmail: string;
  timeSlotID: number;
}

export interface Appointment_Controller_Interface {
  //book online appointment - access by patient
  Book_Online_Appointment(
    req: Request<Booking_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  );

  //confirm online appointment - access by patient
  Confirm_Online_Appointment(
    req: Request<Confirm_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  );

  //cancel online appointment - access by patient
  Cancel_Online_Appointment(
    req: Request<Confirm_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  );

  // view pending appointments - access by both patient and doctor
  View_Pending_Appointments(req: Request, res: Response, next: NextFunction);
}

class Appointment_Controller implements Appointment_Controller_Interface {
  constructor() {
    this.Book_Online_Appointment = this.Book_Online_Appointment.bind(this);
    this.Confirm_Online_Appointment =
      this.Confirm_Online_Appointment.bind(this);
    this.Cancel_Online_Appointment = this.Cancel_Online_Appointment.bind(this);
    this.View_Pending_Appointments = this.View_Pending_Appointments.bind(this);
  }

  private setAppointmentDay(weekday: number, thisweek: boolean): Date {
    let today: number, appointmentDay: Date;

    today = (new Date().getDay() + 2)%7;
    const day_diff = weekday - today;


    // if (thisweek) {
    //   appointmentDay = new Date();
    // } else {
    //   // appointmentDay is next week
    //   appointmentDay = new Date();
    //   appointmentDay.setDate(appointmentDay.getDate() + 7);
    // }

    appointmentDay = new Date();

  

    appointmentDay.setDate(
      appointmentDay.getDate() + (day_diff >=0 ? day_diff%7 : (day_diff + 7)%7) // -2 because weekday starts from 2
    );
    appointmentDay.setHours(0, 0, 0, 0);

    log.info(
      appointmentDay.toDateString(),
      "appointmentDay in setAppointmentDay"
    );
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
  // ----------------- Cancel Online Appointment ----------------- //
  async Cancel_Online_Appointment(
    req: Request<Confirm_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);
    const patientID = req.user_identity?.id as number;

    try {
      await appointmentService.Delete_Temporary_Appointment(
        appointmentID,
        patientID
      );

      res.status(200).json({
        message: "Appointment cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // ----------------- Confirm Online Appointment ----------------- //

  async Confirm_Online_Appointment(
    req: Request<Confirm_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const appointmentID = Number(req.params.appointmentID);
    const patientID = req.user_identity?.id as number;
    const patientEmail = req.user_identity?.email as string;

    try {
      const appointment =
        await appointmentService.Confirm_Temporary_Online_Appointment(
          appointmentID,
          patientID,
          patientEmail
        );

      res.status(200).json({
        message: "Appointment confirmed successfully",
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    req: Request<Booking_Online_Appointment_Params_Input>,
    res: Response,
    next: NextFunction
  ) {
    const scheduleID = Number(req.params.scheduleID);
    log.debug(scheduleID, "scheduleID in Book_Online_Appointment");
    log.debug(typeof scheduleID, "scheduleID type in Book_Online_Appointment");

    const patientID = Number(req.user_identity?.id);
    const patientEmail = req.user_identity?.email as string;
    try {
      // check if week day is less than today
      const timeSlotInfo: AppointmentTimeSlot =
        await appointmentService.Get_Schedule_Info_From_Doctor_Server(
          scheduleID
        );

      if (!timeSlotInfo) throw createHttpError(404, "Schedule not found");

      if (timeSlotInfo.remainingSlots === 0)
        throw createHttpError(400, "No slot available");

      const doctorID = timeSlotInfo.doctorID;
      const timeSlotID = timeSlotInfo.id;
      const weekday = timeSlotInfo.weekday;
      const startTime = timeSlotInfo.startTime;
      const endTime = timeSlotInfo.endTime;
      const totalSlots = timeSlotInfo.totalSlots;

      const today = (new Date().getDay() + 2) % 7;

      let appointmentDay: Date;

      log.info(`weekday - ${weekday} && today - ${today} `);

      // construct appointmentDay from weekday
      if (weekday < today)
        appointmentDay = this.setAppointmentDay(weekday, false);
      else appointmentDay = this.setAppointmentDay(weekday, true);

      log.info(appointmentDay.toDateString(), "appointment day setted");

      // construct appointment_day_start_time and appointment_day_end_time
      const appointment_day_start_time = new Date(
        this.setAppointmentDayTime(appointmentDay, startTime)
      );

      log.info(
        appointment_day_start_time.toTimeString(),
        "appointment_day_start_time"
      );

      const appointment_day_end_time = new Date(
        this.setAppointmentDayTime(appointmentDay, endTime)
      );

      log.info(
        appointment_day_end_time.toTimeString(),
        "appointment_day_end_time"
      );

      // check patient has already booked appointment with the doctor on that day
      const isAlreadyBooked =
        await appointmentService.Patient_Booked_Appointment_In_That_Day(
          patientID,
          appointment_day_start_time,
          appointment_day_end_time
        );
      if (isAlreadyBooked)
        throw createHttpError(
          400,
          "You have already booked appointment in that time slot"
        );

      // construct time interval for each slot according to totalSlots and startTime & endTime
      const timeInterval_forEachSlot = Math.floor(
        (appointment_day_end_time.getTime() -
          appointment_day_start_time.getTime()) /
          totalSlots
      );

      // construct slotRequest
      const slotRequest: SlotRequest = {
        appointmentDay,
        day_startTime: appointment_day_start_time,
        day_endTime: appointment_day_end_time,
        totalSlots,
        timeInterval_forEachSlot,
        patientEmail,
        timeSlotID,
      };

      // book temporary online appointment
      const appointment =
        await appointmentService.Book_Temporary_Online_Appointment(
          doctorID,
          patientID,
          slotRequest
        );

      // send response
      res.status(200).json({
        message: "Confirm the appointment within 5 minutes",
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }

  // view pending appointments
  async View_Pending_Appointments(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    log.info(req.user_identity, "user_identity in View_Pending_Appointments");
    log.info(req.query, "query in View_Pending_Appointments");
    log.info(req.params, "params in View_Pending_Appointments");

    const role = req.user_identity?.role;

    // Initialize search_appointment_input with default values
    let search_appointment_input: Search_Appointment_Input = {
      type: req.query.type
        ? (req.query.type as string)
        : AppointmentType.ONLINE,

      status: AppointmentStatus.PENDING,

      filterByStartTime: req.query.fromDate
        ? new Date(req.query.fromDate as string)
        : null,

      filterByEndTime: req.query.toDate
        ? new Date(req.query.toDate as string)
        : null,

      patientID: null,
      doctorID: null,
      doctorName: null,
      patientName: null,
    };

    if (role === "patient") {
      search_appointment_input.patientID = req.user_identity?.id as number;
      search_appointment_input.doctorName = req.query.searchByName
        ? (req.query.searchByName as string)
        : null;
    } else if (role === "doctor") {
      search_appointment_input.doctorID = req.user_identity?.id as number;
      search_appointment_input.patientName = req.query.searchByName
        ? (req.query.searchByName as string)
        : null;
    }

    log.info(
      search_appointment_input,
      "search_appointment_input in View_Pending_Appointments"
    );

    try {
      const pendingAppointments =
        await appointmentService.Search_Pending_Appointment(
          search_appointment_input,
          req.query.pagination ? Number(req.query.pagination) : 5,
          req.params.currentPage ? Number(req.params.currentPage) : 1,
          role === "patient"
        );

      res.status(200).json({
        message: "Pending appointments fetched successfully",
        pendingAppointments,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new Appointment_Controller();
