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

  appointmentStartTime: Date;
  appointmentEndTime: Date;
}

export interface AppointmentConfirmingInput {
  doctorName: string;
  doctorEmail: string;

  patientName: string;
  patientEmail: string;

  patientCredentials: JSON;
}

export interface Appointment_List {
  appointments: Appointment[];
  totalCount: number;
}

export interface Search_Appointment_Input {
  type: string;
  status: string;

  doctorID: number | null;
  doctorName: string | null;

  patientID: number | null;
  patientName: string | null;

  filterByStartTime: Date | null;
  filterByEndTime: Date | null;
}

export interface TimeSlot {
  startTime: Date;
  endTime: Date;
}

export interface Appointment_Repository_Interface {
  // book temporary appointment
  Book_Temporary_Appointment(
    req: AppointmentBookingInput
  ): Promise<Appointment>;
  // book online appointment
  Confirm_Online_Appointment(
    appointmentID: number,
    req: AppointmentConfirmingInput
  ): Promise<Appointment>;

  // delete appointment
  Delete_Appointment(appointmentID: number, patientID: number): Promise<void>;

  // lastest booking appointment time
  Find_Booking_Appointment_Time_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date,
    timeInterval_of_eachSlot: number
  ): Promise<Date>;

  // check if there is any temporary appointment in that day
  Is_There_Any_Temporary_Appointment_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean>;

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

  // get appointment by id
  Get_AppointmentInfo(appointmentID: number): Promise<Appointment>;
}

class AppointmentRepository implements Appointment_Repository_Interface {
  private constructSearchAppointmentQuery(req: Search_Appointment_Input) {
    let searchCriteria: any = {};

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

    log.info(searchQuery, "searchQuery in constructSearchAppointmentQuery");

    return searchQuery;
  }

  // ----------------- Get Appointment Info ----------------- //
  async Get_AppointmentInfo(appointmentID: number): Promise<Appointment> {
    try {
      const appointment = await Appointment.findByPk(appointmentID);
      if (!appointment) throw createHttpError(404, "Appointment not found");
      return appointment;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Delete Appointment ----------------- //
  async Delete_Appointment(
    appointmentID: number,
    patientID: number
  ): Promise<void> {
    try {
      const appointment = await Appointment.findByPk(appointmentID);
      if (!appointment) throw createHttpError(404, "Appointment not found");
      if (appointment.patientID !== patientID)
        throw createHttpError(
          403,
          "You are not authorized to delete this appointment"
        );
      // delete appointment
      await appointment.destroy();
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Book Online Appointment ----------------- //
  async Confirm_Online_Appointment(
    appointmentID: number,
    req: AppointmentConfirmingInput
  ): Promise<Appointment> {
    try {
      // find appointment
      const appointment = await Appointment.findByPk(appointmentID);
      if (!appointment) throw createHttpError(404, "Appointment not found");

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

        startTime: appointment.startTime,
        endTime: appointment.endTime,

        otherAttendees: [req.doctorEmail, req.patientEmail],
      };

      const meetLink = await googleCalendarApi.createEvent(event, authClient);

      // update meet link
      appointment.meetingLink = meetLink;
      await appointment.save();

      return appointment;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  // ----------------- Lastest Booking Appointment Time ----------------- //
  async Find_Booking_Appointment_Time_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date,
    timeInterval_of_eachSlot: number
  ): Promise<Date> {
    try {
      // find a time gap between day_startTime and day_endTime where no appointment is booked that is there is no entry in database
      // for that time gap

      // find all appointments in that day
      const appointments = await Appointment.findAll({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [day_startTime, day_endTime],
          },
        },
        order: [["startTime", "ASC"]],
      });

      for (let i = 0; i < appointments.length - 1; i++) {
        if (
          appointments[i + 1].startTime.getTime() -
            appointments[i].endTime.getTime() >=
          timeInterval_of_eachSlot
        ) {
          return appointments[i].endTime;
        }
      }

      // if no time gap found
      // then return the last appointment end time
      return appointments[appointments.length - 1].endTime;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  async Is_There_Any_Temporary_Appointment_In_That_Day(
    doctorID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean> {
    try {
      const appointment = await Appointment.findOne({
        where: {
          doctorID: doctorID,
          startTime: {
            [Op.between]: [day_startTime, day_endTime],
          },
          status: AppointmentStatus.TEMPORARY,
        },
      });

      if (appointment) return true;
      else return false;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Internal Server Error");
    }
  }

  async Book_Temporary_Appointment(
    req: AppointmentBookingInput
  ): Promise<Appointment> {
    try {
      // create temporary appointment
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
        status: AppointmentStatus.TEMPORARY,
      });

      return appointment;
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
