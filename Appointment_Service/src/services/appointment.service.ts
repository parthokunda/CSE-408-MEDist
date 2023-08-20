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
import { config } from "../config";

export interface AppointmentServiceInterface {
  // book online appointment
  Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<Appointment>;

  // serve RPC request
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
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

      // get userID from patientID
      let payload: RPC_Request_Payload = {
        type: "GET_GOOGLE_CALENDAR_TOKEN",
        data: {
          email: slotRequest.patientEmail,
        },
      };

      const auth_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.AUTH_RPC_QUEUE, payload);

      log.debug(auth_response_payload, "auth_response_payload");

      if (auth_response_payload.status === "error")
        throw createHttpError(500, "Error in message broker - from auth");
      if (auth_response_payload.status === "not_found")
        throw createHttpError(404, "User not found - from auth message broker");

      // get doctor's email from doctorID
      payload = {
        type: "GET_EMAIL_FROM_ID",
        data: {
          doctorID,
        },
      };

      const doctor_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.DOCTOR_RPC_QUEUE, payload);

      log.debug(doctor_response_payload, "doctor_response_payload");

      if (doctor_response_payload.status === "error")
        throw createHttpError(500, "Error in message broker - from doctor");

      const doctorEmail = doctor_response_payload.data["email"];

      const credentials = auth_response_payload.data["credentials"];

      const patientEmail = slotRequest.patientEmail || "";

      const newAppointment = appointmentRepository.Book_Online_Appointment(
        doctorID,
        patientID,
        startTime,
        endTime,
        credentials,
        doctorEmail,
        patientEmail
      );

      return newAppointment;
    } catch (error) {
      throw error;
    }
  }

  // ----------------- Server side RPC request handler ----------------- //
  async serveRPCRequest(
    payload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    log.debug(payload, "Rpc request payload");

    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };

    switch (payload.type) {
      default:
        break;
    }

    return response;
  }
}

export default new AppointmentService();
