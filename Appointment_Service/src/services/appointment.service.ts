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
import {
  AppointmentBookingInput,
  appointmentRepository,
} from "../database/repository";
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
  // get patient google calendar token
  private async getPatient_Google_Calendar_Credentials(
    patientEmail: string
  ): Promise<JSON> {
    const payload: RPC_Request_Payload = {
      type: "GET_GOOGLE_CALENDAR_TOKEN",
      data: {
        email: patientEmail,
      },
    };

    log.debug(payload, "payload - for 'GET_GOOGLE_CALENDAR_TOKEN'");

    const auth_response_payload: RPC_Response_Payload =
      await broker.RPC_Request(config.AUTH_RPC_QUEUE, payload);

    log.debug(
      auth_response_payload,
      "response payload - from auth - for 'GET_GOOGLE_CALENDAR_TOKEN'"
    );

    if (auth_response_payload.status !== "success")
      throw createHttpError(500, "Error in message broker - from auth");

    return auth_response_payload.data["credentials"];
  }

  // get doctor email from doctorID
  private async getDoctorEmail(doctorID: number): Promise<string> {
    const payload = {
      type: "GET_EMAIL_FROM_ID",
      data: {
        doctorID,
      },
    };

    log.debug(payload, "payload - for 'GET_EMAIL_FROM_ID'");

    const doctor_response_payload: RPC_Response_Payload =
      await broker.RPC_Request(config.DOCTOR_RPC_QUEUE, payload);

    log.debug(
      doctor_response_payload,
      "response payload - from doctor - for 'GET_EMAIL_FROM_ID'"
    );

    if (doctor_response_payload.status !== "success")
      throw createHttpError(500, "Error in message broker - from doctor");

    return doctor_response_payload.data["email"];
  }

  // ----------------- Book Online Appointment ----------------- //
  async Book_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<Appointment> {
    try {
      // check if patient has already booked an appointment
      const patientBookedAppointmentInThatDay =
        await appointmentRepository.Patient_Booked_Appointment_In_That_Day(
          patientID,
          slotRequest.day_startTime,
          slotRequest.day_endTime
        );

      if (patientBookedAppointmentInThatDay)
        throw createHttpError(400, "Patient has already booked an appointment");

      // get latest booking appointment time
      const latestBookingAppointmentTime =
        await appointmentRepository.Lastest_Booking_Appointment_Time_In_That_Day(
          doctorID,
          slotRequest.day_startTime,
          slotRequest.day_endTime
        );

      // check if latestBookingAppointmentTime + timeInterval is less than endTime
      // if so, then doctor is not available on that day
      if (
        latestBookingAppointmentTime.getTime() +
          slotRequest.timeInterval_forEachSlot >
        slotRequest.day_endTime.getTime()
      ) {
        throw createHttpError(400, "Doctor is not available on that day");
      }

      // construct startTime and endTime accordingly
      const startTime = new Date(latestBookingAppointmentTime);
      startTime.setTime(
        startTime.getTime() + slotRequest.timeInterval_forEachSlot
      );

      const endTime = new Date(startTime);
      endTime.setTime(endTime.getTime() + slotRequest.timeInterval_forEachSlot);

      // get credentials from patient email
      const credentials = await this.getPatient_Google_Calendar_Credentials(
        slotRequest.patientEmail
      );

      // get doctor's email from doctorID
      const doctorEmail = await this.getDoctorEmail(doctorID);

      const appointmentInput: AppointmentBookingInput = {
        doctorID,
        doctorEmail,

        patientID,
        patientEmail: slotRequest.patientEmail,

        patientCredentials: credentials,

        appointmentStartTime: startTime,
        appointmentEndTime: endTime,
      };

      const newAppointment =
        appointmentRepository.Book_Online_Appointment(appointmentInput);

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
