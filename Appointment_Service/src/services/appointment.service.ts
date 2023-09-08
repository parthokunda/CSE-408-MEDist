// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  BrokerServiceInterface,
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import {
  Appointment,
  AppointmentTimeSlot,
  AppointmentType,
  Patient_or_Doctor_Info,
  AppointmentOverviewInfo,
  PendingAppointments,
  FinalAppointmentOverviewInfo,
  OlderAppointmentOverviewInfo,
  OlderAppointmentOverviewInfo_Excluded_Properties,
  AppointmentStatus,
  PrescriptionOutput,
} from "../database/models";

// repository instance
import {
  AppointmentBookingInput,
  AppointmentConfirmingInput,
  Appointment_List,
  Search_Appointment_Input,
  appointmentRepository,
} from "../database/repository";
import { SlotRequest } from "../controller/appointment.controller";
import { config } from "../config";
import brokerService from "../utils/broker";
import { excludeProperties } from "../utils/necessary_functions";
import prescriptionService from "./prescription.service";

export interface AppointmentServiceInterface {
  // check if patient has already booked an appointment
  Patient_Booked_Appointment_In_That_Day(
    patientID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean>;

  // get shedule info from doctor_server
  Get_Schedule_Info_From_Doctor_Server(
    scheduleID: number
  ): Promise<AppointmentTimeSlot>;

  // book online appointment
  Book_Temporary_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<AppointmentOverviewInfo>;

  // confirm online appointment
  Confirm_Temporary_Online_Appointment(
    appointmentID: number,
    patientID: number,
    patientEmail: string
  ): Promise<AppointmentOverviewInfo>;

  // get other appointments
  Get_Other_Appointments(
    appointmentIDs: number[]
  ): Promise<AppointmentOverviewInfo[]>;

  // add other prescriptions to confirmed appointment
  Add_Other_Prescriptions_To_Confirmed_Appointment(
    appointmentID: number,
    patientID: number,
    otherAppointmentIDs: number[]
  ): Promise<AppointmentOverviewInfo>;

  // delete appointment
  Delete_Temporary_Appointment(
    appointmentID: number,
    patientID: number
  ): Promise<void>;

  //search appointment
  Search_Pending_Appointment(
    req: Search_Appointment_Input,
    pagination: number,
    currentPage: number,
    isPatient: boolean
  ): Promise<PendingAppointments>;

  // get final appointment overview info
  Get_Final_Appointment_Overview_Info(
    appointmentID: number,
    doctorID: number | null,
    patientID: number | null
  ): Promise<FinalAppointmentOverviewInfo>;

  //view appointment
  View_Appointment(
    appointmentID: number,
    patientID: number | null,
    doctorID: number | null
  ): Promise<FinalAppointmentOverviewInfo | PrescriptionOutput>;

  // serve RPC request
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
}

class AppointmentService implements AppointmentServiceInterface {
  // get credentials and doctorInfo and Patient_Name simultaneously
  private async get_PatientCredentialsInfo_Name_and_DoctorInfo(
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

  // get doctorInfo and Patient_Name simultaneously
  private async PatientName_and_DoctorInfo(
    patientID: number,
    doctorID: number
  ) {
    try {
      // parrallel execution of both task
      const doctorInfoPromise = this.getDoctorInfo(doctorID);

      const patientNamePromise = this.getPatientName(patientID);

      // wait for both task to complete
      const [doctorInfo, patientName] = await Promise.all([
        doctorInfoPromise,
        patientNamePromise,
      ]);

      return {
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

  // ----------------- Get Schedule Info From Doctor Server ----------------- //
  async Get_Schedule_Info_From_Doctor_Server(
    scheduleID: number
  ): Promise<AppointmentTimeSlot> {
    try {
      const payload = {
        type: "GET_SCHEDULE_INFO_FROM_ID",
        data: {
          scheduleID,
        },
      };

      log.debug(payload, "payload - for 'GET_SCHEDULE_INFO_FROM_ID'");

      const doctor_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.DOCTOR_RPC_QUEUE, payload);

      log.debug(
        doctor_response_payload,
        "response payload - from doctor - for 'GET_SCHEDULE_INFO_FROM_ID'"
      );

      if (doctor_response_payload.status !== "success")
        throw createHttpError(500, "Error in message broker - from doctor");

      return {
        id: doctor_response_payload.data["id"],
        doctorID: doctor_response_payload.data["doctorID"],
        weekday: doctor_response_payload.data["weekday"],
        startTime: doctor_response_payload.data["startTime"],
        endTime: doctor_response_payload.data["endTime"],
        totalSlots: doctor_response_payload.data["totalSlots"],
        remainingSlots: doctor_response_payload.data["remainingSlots"],
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- Delete Appointment ----------------- //
  async Delete_Temporary_Appointment(
    appointmentID: number,
    patientID: number
  ): Promise<void> {
    try {
      const appointment = await appointmentRepository.Get_AppointmentInfo(
        appointmentID
      );

      const timeSlotID = appointment.timeSlotID;

      await appointmentRepository.Delete_Appointment(appointmentID, patientID);

      // publish to doctor server
      const payload: RPC_Request_Payload = {
        type: "DELETED_TEMP_APPOINTMENT",
        data: {
          appointmentID,
          timeSlotID,
        },
      };

      log.debug(payload, "payload - for 'DELETED_APPOINTMENT'");
      await brokerService.PUBLISH_TO_EXCHANGE(
        config.TEMPORARAY_APPOINTMENT_DELETION_EXCHANGE,
        payload
      );
    } catch (error) {
      throw error;
    }
  }

  // ----------------- Check if Patient Booked Appointment In That Day ----------------- //
  async Patient_Booked_Appointment_In_That_Day(
    patientID: number,
    day_startTime: Date,
    day_endTime: Date
  ): Promise<boolean> {
    try {
      const patientBookedAppointmentInThatDay =
        await appointmentRepository.Patient_Booked_Appointment_In_That_Day(
          patientID,
          day_startTime,
          day_endTime
        );

      return patientBookedAppointmentInThatDay;
    } catch (error) {
      throw error;
    }
  }

  // ----------------- Book Online Appointment ----------------- //
  async Book_Temporary_Online_Appointment(
    doctorID: number,
    patientID: number,
    slotRequest: SlotRequest
  ): Promise<AppointmentOverviewInfo> {
    try {
      // get a free time slot for booking appointment time
      const freeBookingAppointmentTime =
        await appointmentRepository.Find_Booking_Appointment_Time_In_That_Day(
          doctorID,
          slotRequest.day_startTime,
          slotRequest.day_endTime,
          slotRequest.timeInterval_forEachSlot
        );

      // if no free time slot found
      if (
        freeBookingAppointmentTime.getTime() > slotRequest.day_endTime.getTime()
      ) {
        if (
          await appointmentRepository.Is_There_Any_Temporary_Appointment_In_That_Day(
            doctorID,
            slotRequest.day_startTime,
            slotRequest.day_endTime
          )
        ) {
          throw createHttpError.NotFound(
            "No free time slot found, But there is temporary appointment in that day. So try again later"
          );
        }
        throw createHttpError.NotFound("No free time slot found");
      }

      // construct startTime and endTime accordingly
      const startTime = new Date(freeBookingAppointmentTime);

      const endTime = new Date(startTime);
      endTime.setTime(endTime.getTime() + slotRequest.timeInterval_forEachSlot);

      // get patient credentials and doctor email
      const { doctorInfo, patientName } = await this.PatientName_and_DoctorInfo(
        patientID,
        doctorID
      );

      // construct temporary appointment
      const appointmentInput: AppointmentBookingInput = {
        doctorID,
        doctorName: doctorInfo.name,
        doctorEmail: doctorInfo.email,

        patientID,
        patientName,
        patientEmail: slotRequest.patientEmail,

        appointmentStartTime: startTime,
        appointmentEndTime: endTime,

        timeSlotID: slotRequest.timeSlotID,
      };

      const newAppointment =
        await appointmentRepository.Book_Temporary_Appointment(
          appointmentInput
        );

      if (!newAppointment)
        throw createHttpError(500, "Error in booking temporary appointment");

      // publish to doctor server
      const payload: RPC_Request_Payload = {
        type: "BOOKED_TEMP_APPOINTMENT",
        data: {
          appointmentID: newAppointment.id,
          timeSlotID: newAppointment.timeSlotID,
        },
      };

      log.debug(payload, "payload - for 'BOOKED_TEMP_APPOINTMENT'");
      await brokerService.PUBLISH_TO_EXCHANGE(
        config.APPOINTMENT_CREATION_EXCHANGE,
        payload
      );

      return {
        id: newAppointment.id,
        type: newAppointment.type,
        status: newAppointment.status,

        doctorInfo,
        patientInfo: null,

        startTime: newAppointment.startTime,
        endTime: newAppointment.endTime,

        meetingLink: null,
      };
    } catch (error) {
      throw error;
    }
  }

  async Get_Other_Appointments(
    appointmentIDs: number[]
  ): Promise<AppointmentOverviewInfo[]> {
    try {
      const appointments = await Promise.all(
        appointmentIDs.map(async (appointmentID) => {
          const appointment = await appointmentRepository.Get_AppointmentInfo(
            appointmentID
          );
          if (!appointment) throw createHttpError(404, "Appointment not found");

          return appointment;
        })
      );

      const appointmentOverviewInfos = appointments.map((appointment) => {
        return {
          id: appointment.id,
          type: appointment.type,
          status: appointment.status,

          doctorInfo: {
            id: appointment.doctorID,
            name: appointment.doctorName,
            email: appointment.doctorEmail,
          },

          patientInfo: {
            id: appointment.patientID,
            name: appointment.patientName,
            email: appointment.patientEmail,
          },

          startTime: appointment.startTime,
          endTime: appointment.endTime,

          meetingLink: appointment.meetingLink,
        };
      });

      return appointmentOverviewInfos;
    } catch (error) {
      log.error(error, "Error in getting other appointments");
      throw error;
    }
  }

  // ----------------- View Appointment ----------------- //
  async View_Appointment(
    appointmentID: number,
    patientID: number | null,
    doctorID: number | null
  ): Promise<FinalAppointmentOverviewInfo | PrescriptionOutput> {
    try {
      const appointment = await appointmentRepository.Get_AppointmentInfo(
        appointmentID
      );
      if (!appointment) throw createHttpError(404, "Appointment not found");

      if (
        (patientID !== null && appointment.patientID !== patientID) ||
        (doctorID !== null && appointment.doctorID !== doctorID)
      )
        throw createHttpError.Unauthorized(
          "You are not authorized to view this appointment"
        );

      if (appointment.status === AppointmentStatus.PENDING) {
        const finalAppointmentOverviewInfo =
          await this.Get_Final_Appointment_Overview_Info(
            appointmentID,
            doctorID,
            patientID
          );

        return finalAppointmentOverviewInfo;
      } else {
        const prescriptionOutput = await prescriptionService.getPrescription(
          appointmentID
        );

        return prescriptionOutput;
      }
    } catch (error) {
      throw error;
    }
  }

  async Get_Final_Appointment_Overview_Info(
    appointmentID: number,
    doctorID: number | null,
    patientID: number | null
  ): Promise<FinalAppointmentOverviewInfo> {
    try {
      const appointment = await appointmentRepository.Get_AppointmentInfo(
        appointmentID
      );

      if (doctorID !== null && appointment.doctorID != doctorID)
        throw createHttpError.Unauthorized(
          "You are not authorized to get this appointment info"
        );
      if (patientID !== null && appointment.patientID != patientID)
        throw createHttpError.Unauthorized(
          "You are not authorized to get this appointment info"
        );

      let olderAppointments: OlderAppointmentOverviewInfo[] = [];
      let otherAppointments: OlderAppointmentOverviewInfo[] = [];

      if (appointment.olderAppointmentIDs)
        olderAppointments = (
          await this.Get_Other_Appointments(appointment.olderAppointmentIDs)
        ).map((appointment) => {
          return excludeProperties(
            appointment,
            OlderAppointmentOverviewInfo_Excluded_Properties
          );
        });

      if (appointment.otherAppointmentIDs)
        otherAppointments = (
          await this.Get_Other_Appointments(appointment.otherAppointmentIDs)
        ).map((appointment) => {
          return excludeProperties(
            appointment,
            OlderAppointmentOverviewInfo_Excluded_Properties
          );
        });

      const finalAppointmentOverviewInfo: FinalAppointmentOverviewInfo = {
        id: appointment.id,
        type: appointment.type,
        status: appointment.status,

        doctorInfo: {
          id: appointment.doctorID,
          name: appointment.doctorName,
          email: appointment.doctorEmail,
        },

        patientInfo: {
          id: appointment.patientID,
          name: appointment.patientName,
          email: appointment.patientEmail,
        },

        startTime: appointment.startTime,
        endTime: appointment.endTime,

        meetingLink: appointment.meetingLink,

        olderAppointments,
        otherAppointments,
      };

      return finalAppointmentOverviewInfo;
    } catch (error) {
      log.error(error, "Error in getting final appointment overview info");
      throw error;
    }
  }

  // ----------------- Confirm Online Appointment ----------------- //
  async Confirm_Temporary_Online_Appointment(
    appointmentID: number,
    patientID: number,
    patientEmail: string
  ): Promise<FinalAppointmentOverviewInfo> {
    try {
      const appointment = await appointmentRepository.Get_AppointmentInfo(
        appointmentID
      );

      if (appointment.patientID !== patientID)
        throw createHttpError(
          403,
          "You are not authorized to confirm this appointment"
        );

      // get patient credentials and doctor email
      const doctorID = appointment.doctorID;
      const { credentials, doctorInfo, patientName } =
        await this.get_PatientCredentialsInfo_Name_and_DoctorInfo(
          patientID,
          patientEmail,
          doctorID
        );

      const appointmentInput: AppointmentConfirmingInput = {
        patientName,
        patientEmail,
        patientCredentials: credentials,

        doctorName: doctorInfo.name,
        doctorEmail: doctorInfo.email,
      };

      const confirmedAppointment =
        await appointmentRepository.Confirm_Online_Appointment(
          appointmentID,
          appointmentInput
        );

      return await this.Get_Final_Appointment_Overview_Info(
        appointmentID,
        doctorID,
        patientID
      );
    } catch (error) {
      throw error;
    }
  }

  // ----------------- Add Other Prescriptions To Confirmed Appointment ----------------- //
  async Add_Other_Prescriptions_To_Confirmed_Appointment(
    appointmentID: number,
    patientID: number,
    otherAppointmentIDs: number[]
  ): Promise<FinalAppointmentOverviewInfo> {
    try {
      const appointment = await appointmentRepository.Get_AppointmentInfo(
        appointmentID
      );
      if (!appointment) throw createHttpError(404, "Appointment not found");

      if (appointment.status !== AppointmentStatus.PENDING)
        throw createHttpError(
          400,
          "You can only add other appointments to pending appointment"
        );

      if (appointment.patientID !== patientID)
        throw createHttpError.Unauthorized(
          "You are not authorized to add prescription to this appointment"
        );

      const updatedAppointment =
        await appointmentRepository.Add_Other_Appointments(
          appointmentID,
          otherAppointmentIDs
        );
      if (!updatedAppointment)
        throw createHttpError(
          500,
          "Error in adding other appointments to confirmed appointment"
        );

      return await this.Get_Final_Appointment_Overview_Info(
        updatedAppointment.id,
        updatedAppointment.doctorID,
        updatedAppointment.patientID
      );
    } catch (error) {
      log.error(
        error,
        "Error in adding other appointments to confirmed appointment"
      );
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

      log.info(searchResults, "search results for pending appointments");

      // construct pending appointment overview info
      const appointments = searchResults.appointments.map((appointment) => {
        let patientInfo: Patient_or_Doctor_Info = {
          id: appointment.patientID,
          name: appointment.patientName,
          email: appointment.patientEmail,
        };

        let doctorInfo: Patient_or_Doctor_Info = {
          id: appointment.doctorID,
          name: appointment.doctorName,
          email: appointment.doctorEmail,
        };

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
