// external imports
import createHttpError from "http-errors";

// internal imports
import log from "../utils/logger";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

import { config } from "../config";

// import models
import {
  Appointment,
  DoctorPortion,
  PatientPortion,
  Prescription,
  PrescriptionHeader,
} from "../database/models";

// repository instance
import {
  appointmentRepository,
  prescriptionRepository,
} from "../database/repository";

export interface PrescriptionServiceInterface {
  //generate prescription header
  generatePrescriptionHeader(
    appointmentID: number | null,
    prescriptionID: number | null
  ): Promise<PrescriptionHeader>;
}

class PrescriptionService implements PrescriptionServiceInterface {
  //get DoctorInfo and PatientInfo parallelly
  private async getDoctorAndPatientInfo(
    doctorID: number,
    patientID: number
  ): Promise<{ DoctorInfo: DoctorPortion; PatientInfo: PatientPortion }> {
    try {
      const [DoctorInfo, PatientInfo] = await Promise.all([
        this.getDoctorInformation(doctorID),
        this.getPatientInformation(patientID),
      ]);

      return { DoctorInfo, PatientInfo };
    } catch (error) {
      log.error(error);
      throw createHttpError(
        500,
        "Error getting doctor and patient information concurrently for prescription"
      );
    }
  }

  private async getDoctorInformation(doctorID: number): Promise<DoctorPortion> {
    const payload: RPC_Request_Payload = {
      type: "GET_DOCTOR_INFO_FOR_PRESCRIPTION",
      data: {
        doctorID,
      },
    };

    log.debug(payload, "payload - for 'GET_DOCTOR_INFO_FOR_PRESCRIPTION'");

    const doctor_response_payload: RPC_Response_Payload =
      await broker.RPC_Request(config.PATIENT_RPC_QUEUE, payload);

    if (doctor_response_payload.status !== "success")
      throw createHttpError(500, "Error getting doctor information from RPC");

    return {
      DoctorInfo: { ...doctor_response_payload.data["DoctorInfo"] },
      Specialization: { ...doctor_response_payload.data["Specialization"] },
    };
  }

  private async getPatientInformation(
    patientID: number
  ): Promise<PatientPortion> {
    const payload: RPC_Request_Payload = {
      type: "GET_PATIENT_INFO_FOR_PRESCRIPTION",
      data: {
        patientID,
      },
    };

    log.debug(payload, "payload - for 'GET_PATIENT_INFO_FOR_PRESCRIPTION'");

    const patient_response_payload: RPC_Response_Payload =
      await broker.RPC_Request(config.PATIENT_RPC_QUEUE, payload);

    if (patient_response_payload.status !== "success")
      throw createHttpError(500, "Error getting patient information from RPC");

    return { ...patient_response_payload.data } as PatientPortion;
  }

  // ---------------------- Generate Prescription Header ---------------------- //
  async generatePrescriptionHeader(
    appointmentID: number | null,
    prescriptionID: number | null
  ): Promise<PrescriptionHeader> {
    try {
      if (appointmentID === null && prescriptionID === null)
        throw createHttpError(
          400,
          "AppointmentID or PrescriptionID is required"
        );

      let appointment: Appointment;

      //if appointmentID is null then infer from Prescription
      if (appointmentID === null) {
        appointment =
          await prescriptionRepository.getAppointment_fromPrescriptionID(
            prescriptionID!
          );
      } else {
        appointment = await appointmentRepository.Get_AppointmentInfo(
          appointmentID
        );
      }

      const doctorID = appointment.doctorID;
      const patientID = appointment.patientID;

      const { DoctorInfo, PatientInfo } = await this.getDoctorAndPatientInfo(
        doctorID,
        patientID
      );

      return {
        DoctorPortionInfo: DoctorInfo,
        PatientPortionInfo: PatientInfo,
        AppointmentPortionInfo: {
          id: appointment.id,
          type: appointment.type,
          time: appointment.startTime,
        },
      };
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}

export default new PrescriptionService();
