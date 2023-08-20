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
  doctorName: string;
  doctorEmail: string;

  patientID: number;
  patientName: string;
  patientEmail: string;

  patientCredentials: JSON;

  appointmentStartTime: Date;
  appointmentEndTime: Date;
}

export interface Appointment_List {
  appointments: Appointment[];
  totalCount: number;
}

export interface Search_Appointment_Input {
  type: AppointmentType;
  status: AppointmentStatus;

  doctorID: number | null;
  doctorName: string | null;

  patientID: number | null;
  patientName: string | null;

  filterByStartTime: Date | null;
  filterByEndTime: Date | null;
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

  // search appointments
  Search_Appointments(
    req: Search_Appointment_Input,
    pagination: number,
    currentPage: number
  ): Promise<Appointment_List>;
}

class AppointmentRepository implements Appointment_Repository_Interface {
  private constructSearchAppointmentQuery(req: Search_Appointment_Input) {
    let searchCriteria: any;

    // include status and type in search criteria
    searchCriteria.status = req.status;
    searchCriteria.type = req.type;

    // include doctorID or patientID in search criteria
    if (req.doctorID) {
      searchCriteria.doctorID = req.doctorID;
    } else if (req.patientID) {
      searchCriteria.patientID = req.patientID;
    }

    // include filter by date in search criteria
    if (req.filterByStartTime && req.filterByEndTime) {
      searchCriteria.startTime = {
        [Op.between]: [req.filterByStartTime, req.filterByEndTime],
      };
    } else if (req.filterByStartTime) {
      searchCriteria.startTime = {
        [Op.gte]: req.filterByStartTime,
      };
    } else if (req.filterByEndTime) {
      searchCriteria.startTime = {
        [Op.lte]: req.filterByEndTime,
      };
    }

    let searchQuery: any;

    // if doctor name(partial or full) is given
    if (req.doctorName) {
      searchQuery = {
        [Op.or]: [
          {
            doctorName: {
              [Op.iLike]: `${req.doctorName}%`, // case insensitive starts with search
            },
            ...searchCriteria,
          },
          {
            doctorName: {
              [Op.iLike]: `%${req.doctorName}%`, // case insensitive contains search
            },
            ...searchCriteria,
          },
        ],
      };
    } else if (req.patientName) {
      searchQuery = {
        [Op.or]: [
          {
            patientName: {
              [Op.iLike]: `${req.patientName}%`, // case insensitive starts with search
            },
            ...searchCriteria,
          },
          {
            patientName: {
              [Op.iLike]: `%${req.patientName}%`, // case insensitive contains search
            },
            ...searchCriteria,
          },
        ],
      };
    } else {
      searchQuery = searchCriteria;
    }

    return searchQuery;
  }

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
        summary: "Online Appointment - Powered by MEDist",
        description: `Appointment with Dr. ${req.doctorName}	
        Patient Name: ${req.patientName}`,

        startTime: req.appointmentStartTime,
        endTime: req.appointmentEndTime,

        otherAttendees: [req.doctorEmail, req.patientEmail],
      };

      const meetLink = await googleCalendarApi.createEvent(event, authClient);

      // create appointment
      const appointment = await Appointment.create({
        doctorID: req.doctorID,
        doctorEmail: req.doctorEmail,
        doctorName: req.doctorName,

        patientID: req.patientID,
        patientEmail: req.patientEmail,
        patientName: req.patientName,

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

  // ----------------- Search Appointments ----------------- //
  async Search_Appointments(
    req: Search_Appointment_Input,
    pagination: number,
    currentPage: number
  ): Promise<Appointment_List> {
    try {
      const searchQuery = this.constructSearchAppointmentQuery(req);

      const itemsPerPage = pagination;
      const offset = (currentPage - 1) * itemsPerPage;

      const appointments = await Appointment.findAll({
        where: searchQuery,
        order: [["startTime", "DESC"]],
        offset,
        limit: itemsPerPage,
      });

      const totalCount = await Appointment.count({
        where: searchQuery,
      });

      return {
        appointments,
        totalCount,
      };
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }
}

export default new AppointmentRepository();
