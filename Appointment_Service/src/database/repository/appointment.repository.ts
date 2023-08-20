//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import { Appointment, AppointmentStatus, AppointmentType } from "../models";

// googleCalendarApi
import googleCalendarApi, { calendarEvent } from "../../utils/google.auth";

export interface AppointmentBookingInput {
  doctorID: number;
  doctorEmail: string;

  patientID: number;
  patientEmail: string;

  patientCredentials: JSON;

  appointmentStartTime: Date;
  appointmentEndTime: Date;
}

export interface Appointment_Repository_Interface {
  // book online appointment
  Book_Online_Appointment(req: AppointmentBookingInput): Promise<Appointment>;

  // lastest booking appointment time
  Lastest_Booking_Appointment_Time_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<Date>;

  // total slot booked
  Total_Slot_Booked_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<number>;

  // check if patient has already booked an appointment
  Patient_Booked_Appointment_In_That_Day(
    patientID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean>;
}

class AppointmentRepository implements Appointment_Repository_Interface {
  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    req: AppointmentBookingInput
  ): Promise<Appointment> {
    try {
      // have to generate meet link
      const authClient = await googleCalendarApi.createClient(
        req.patientCredentials
      );
      if (!authClient)
        throw createHttpError(
          500,
          "Internal Server Error - creating authClient"
        );

      const event: calendarEvent = {
        summary: "Online Appointment",
        description: "Online Appointment",

        startTime: req.appointmentStartTime,
        endTime: req.appointmentEndTime,

        otherAttendees: [req.doctorEmail, req.patientEmail],
      };

      const meetLink = await googleCalendarApi.createEvent(event, authClient);

      // create appointment
      const appointment = await Appointment.create({
        doctorID: req.doctorID,
        patientID: req.patientID,

        startTime: req.appointmentStartTime,
        endTime: req.appointmentEndTime,

        type: AppointmentType.ONLINE,
        meetingLink: meetLink,
      });

      return appointment;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Lastest Booking Appointment Time ----------------- //
  async Lastest_Booking_Appointment_Time_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<Date> {
    try {
      // get lastest appointment time
      // which is in range [startTime, endTime]

      const lastestAppointment = await Appointment.findOne({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [day_startTime, day_endTime],
          },
        },
        order: [["startTime", "DESC"]],
      });

      if (lastestAppointment) {
        return lastestAppointment.startTime;
      } else {
        return day_startTime;
      }
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Total Slot Booked ----------------- //
  async Total_Slot_Booked_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<number> {
    try {
      const totalSlotBooked = await Appointment.count({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [day_startTime, day_endTime],
          },
        },
      });

      return totalSlotBooked;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Patient Booked Appointment In That Day ----------------- //
  async Patient_Booked_Appointment_In_That_Day(
    patientID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean> {
    try {
      const patientAppointment = await Appointment.findOne({
        where: {
          patientID: patientID,
          startTime: {
            [Op.between]: [day_startTime, day_endTime],
          },
        },
      });

      if (patientAppointment) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }
}

export default new AppointmentRepository();
