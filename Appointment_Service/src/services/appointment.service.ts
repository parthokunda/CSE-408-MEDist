// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import {
  Appointment,
  Patient_or_Doctor_Info,
  PendingAppointmentOverviewInfo,
  PendingAppointments,
} from "../database/models";

// repository instance
import {
  AppointmentBookingInput,
  Appointment_List,
  Search_Appointment_Input,
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

  //search appointment
  Search_Pending_Appointment(
    req: Search_Appointment_Input,
    pagination: number,
    currentPage: number,
    isPatient: boolean
  ): Promise<PendingAppointments>;

  // serve RPC request
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
}

class AppointmentService implements AppointmentServiceInterface {
  // get credentials and email simultaneously
  private async get_PatientCredentialsName_DoctorEmail(
    patientID: number,
    patientEmail: string,
    doctorID: number
  ) {
    try {
      // parrallel execution of both task
      const credentialsPromise =
        this.getPatient_Google_Calendar_Credentials(patientEmail);

      const doctorInfoPromise = this.getDoctorInfo(doctorID);

      const patientNamePromise = this.getPatientName(patientID);

      // wait for both task to complete
      const [credentials, doctorInfo, patientName] = await Promise.all([
        credentialsPromise,
        doctorInfoPromise,
        patientNamePromise,
      ]);

      return {
        credentials,
        doctorInfo,
        patientName,
      };
    } catch (error) {
      throw error;
    }
  }

  // get patient name from patientID
  private async getPatientName(patientID: number): Promise<string> {
    const payload = {
      type: "GET_NAME_FROM_ID",
      data: {
        patientID,
      },
    };

    log.debug(payload, "payload - for 'GET_NAME_FROM_ID'");

    const patient_response_payload: RPC_Response_Payload =
      await broker.RPC_Request(config.PATIENT_RPC_QUEUE, payload);

    log.debug(
      patient_response_payload,
      "response payload - from patient - for 'GET_NAME_FROM_ID'"
    );

    if (patient_response_payload.status !== "success")
      throw createHttpError(500, "Error in message broker - from patient");

    return patient_response_payload.data["name"];
  }

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
  private async getDoctorInfo(
    doctorID: number
  ): Promise<Patient_or_Doctor_Info> {
    const payload = {
      type: "GET_EMAIL_AND_NAME_FROM_ID",
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

    return {
      id: doctorID,
      email: doctor_response_payload.data["email"],
      name: doctor_response_payload.data["name"],
    };
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

      // get patient credentials and doctor email
      const { credentials, doctorInfo, patientName } =
        await this.get_PatientCredentialsName_DoctorEmail(
          patientID,
          slotRequest.patientEmail,
          doctorID
        );

      const appointmentInput: AppointmentBookingInput = {
        doctorID,
        doctorName: doctorInfo.name,
        doctorEmail: doctorInfo.email,

        patientID,
        patientName,
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

  // ----------------- Search Appointment ----------------- //
  async Search_Pending_Appointment(
    req: Search_Appointment_Input,
    pagination: number,
    currentPage: number,
    isPatient: boolean
  ): Promise<PendingAppointments> {
    try {
      const searchResults: Appointment_List =
        await appointmentRepository.Search_Appointments(
          req,
          pagination,
          currentPage
        );

      // construct pending appointment overview info
      const appointments = searchResults.appointments.map((appointment) => {
        let patientInfo: Patient_or_Doctor_Info | null = null;
        let doctorInfo: Patient_or_Doctor_Info | null = null;

        if (isPatient) {
          patientInfo = {
            id: appointment.patientID,
            name: appointment.patientName,
            email: appointment.patientEmail,
          };
        } else {
          doctorInfo = {
            id: appointment.doctorID,
            name: appointment.doctorName,
            email: appointment.doctorEmail,
          };
        }

        return {
          id: appointment.id,
          type: appointment.type,
          patientInfo: isPatient ? null : patientInfo,
          doctorInfo: isPatient ? doctorInfo : null,
          startTime: appointment.startTime,
          endTime: appointment.endTime,
          status: appointment.status,
          meetingLink: appointment.meetingLink,
        };
      });

      return {
        appointments,
        totalCount: searchResults.totalCount,
      };
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
