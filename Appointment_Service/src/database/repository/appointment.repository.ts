//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import { Appointment, AppointmentStatus, AppointmentType } from "../models";

export interface Appointment_Repository_Interface {
  // book online appointment
  Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    startTime: Date,
    endTime: Date
  ): Promise<Appointment>;

  // lastest booking appointment time
  Lastest_Booking_Appointment_Time(
    doctorID: number,
    startTime: Date,
    endTime: Date
  ): Promise<Date>;

  // total slot booked
  Total_Slot_Booked(
    doctorID: number,
    startTime: Date,
    endTime: Date
  ): Promise<number>;
}

class AppointmentRepository implements Appointment_Repository_Interface {
  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    startTime: Date,
    endTime: Date
  ): Promise<Appointment> {
    try {
      // check if patient has already booked an appointment
      const patientAppointment = await Appointment.findOne({
        where: {
          patientID: patientID,
          startTime: {
            [Op.between]: [startTime, endTime],
          },
        },
      });

      if (patientAppointment) {
        throw createHttpError(
          400,
          "Patient has already booked an appointment in this time slot"
        );
      }

      // have to generate meet link

      // create appointment
      const appointment = await Appointment.create({
        doctorID: doctorID,
        patientID: patientID,
        startTime: startTime,
        endTime: endTime,
        type: AppointmentType.ONLINE,
      });

      return appointment;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Lastest Booking Appointment Time ----------------- //
  async Lastest_Booking_Appointment_Time(
    doctorID: number,
    startTime: Date,
    endTime: Date
  ): Promise<Date> {
    try {
      // get lastest appointment time
      // which is in range [startTime, endTime]

      const lastestAppointment = await Appointment.findOne({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [startTime, endTime],
          },
        },
        order: [["startTime", "DESC"]],
      });

      if (lastestAppointment) {
        return lastestAppointment.startTime;
      } else {
        return startTime;
      }
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Total Slot Booked ----------------- //
  async Total_Slot_Booked(
    doctorID: number,
    startTime: Date,
    endTime: Date
  ): Promise<number> {
    try {
      const totalSlotBooked = await Appointment.count({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [startTime, endTime],
          },
        },
      });

      return totalSlotBooked;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }
}

export default new AppointmentRepository();
