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
      /* const [DoctorInfo, PatientInfo] = await Promise.all([
        this.getDoctorInformation(doctorID),
        this.getPatientInformation(patientID),
      ]); */

      const DoctorInfo = await this.getDoctorInformation(doctorID);
      const PatientInfo = await this.getPatientInformation(patientID);

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
    try {
      const payload: RPC_Request_Payload = {
        type: "GET_DOCTOR_INFO_FOR_PRESCRIPTION",
        data: {
          doctorID: 2,
        },
      };

      log.debug(payload, "payload - for 'GET_DOCTOR_INFO_FOR_PRESCRIPTION'");

      const doctor_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.DOCTOR_RPC_QUEUE, payload);

      log.debug(
        doctor_response_payload,
        "respnse payload - for 'GET_DOCTOR_INFO_FOR_PRESCRIPTION'"
      );

      if (doctor_response_payload.status !== "success")
        throw createHttpError(500, "Error getting doctor information from RPC");

      return {
        DoctorInfo: { ...doctor_response_payload.data["DoctorInfo"] },
        Specialization: { ...doctor_response_payload.data["Specialization"] },
      };
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error getting doctor information from RPC");
    }
  }

  private async getPatientInformation(
    patientID: number
  ): Promise<PatientPortion> {
    try {
      const payload: RPC_Request_Payload = {
        type: "GET_PATIENT_INFO_FOR_PRESCRIPTION",
        data: {
          patientID: 4,
        },
      };

      log.debug(payload, "payload - for 'GET_PATIENT_INFO_FOR_PRESCRIPTION'");

      const patient_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.PATIENT_RPC_QUEUE, payload);

      log.debug(
        patient_response_payload,
        "respnse payload - for 'GET_PATIENT_INFO_FOR_PRESCRIPTION'"
      );

      if (patient_response_payload.status !== "success")
        throw createHttpError(
          500,
          "Error getting patient information from RPC"
        );

      return { ...patient_response_payload.data } as PatientPortion;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error getting patient information from RPC");
    }
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

      if (!appointment) throw createHttpError(404, "Appointment not found");

      const doctorID = appointment.doctorID;
      const patientID = appointment.patientID;

      const tempPatientInfo = await this.getPatientInformation(patientID);

      log.info(tempPatientInfo, "tempPatientInfo");

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
