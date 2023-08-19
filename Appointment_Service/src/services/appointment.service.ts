// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import { Appointment } from "../database/models";

// repository instance
import { appointmentRepository } from "../database/repository";
import { SlotRequest } from "../controller/appointment.controller";

export interface AppointmentServiceInterface {
  // book online appointment
  Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<Appointment>;
}

class AppointmentService implements AppointmentServiceInterface {
  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<Appointment> {
    try {
      // get latest booking appointment time
      const latestBookingAppointmentTime =
        await appointmentRepository.Lastest_Booking_Appointment_Time(
          doctorID,
          slotRequest.startTime,
          slotRequest.endTime
        );

      // check if latestBookingAppointmentTime + timeInterval is less than endTime
      if (
        latestBookingAppointmentTime.getTime() + slotRequest.timeInterval >
        slotRequest.endTime.getTime()
      ) {
        throw createHttpError(400, "Doctor is not available on that day");
      }

      // construct startTime and endTime accordingly
      const startTime = new Date(latestBookingAppointmentTime);
      startTime.setTime(startTime.getTime() + slotRequest.timeInterval);

      const endTime = new Date(startTime);
      endTime.setTime(endTime.getTime() + slotRequest.timeInterval);

      const newAppointment = appointmentRepository.Book_Online_Appointment(
        doctorID,
        patientID,
        startTime,
        endTime
      );

      return newAppointment;
    } catch (error) {
      throw error;
    }
  }
}

export default new AppointmentService();
