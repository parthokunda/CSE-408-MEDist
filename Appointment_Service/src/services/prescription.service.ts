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
  BrandInfo,
  DoctorPortion,
  PatientPortion,
  Prescription,
  PrescriptionHeader,
  PrescriptionOutput,
} from "../database/models";

// repository instance
import {
  CreatePrescriptionInput,
  appointmentRepository,
  prescriptionRepository,
} from "../database/repository";
import { appointmentService } from ".";

export interface PrescriptionServiceInterface {
  //private methods
  getAllMedicineInfos(brandIDs: number[]): Promise<BrandInfo[]>;
  getSingleMedicineInfo(brandID: number): Promise<BrandInfo>;

  getDoctorAndPatientInfo(
    doctorID: number,
    patientID: number
  ): Promise<{ DoctorInfo: DoctorPortion; PatientInfo: PatientPortion }>;

  getDoctorInformation(doctorID: number): Promise<DoctorPortion>;

  getPatientInformation(patientID: number): Promise<PatientPortion>;

  //generate prescription header
  generatePrescriptionHeader(
    appointmentID: number | null,
    prescriptionID: number | null
  ): Promise<PrescriptionHeader>;

  //create prescription
  createPrescription(
    input: CreatePrescriptionInput
  ): Promise<PrescriptionOutput>;

  //get prescription
  getPrescription(appointmentID: number): Promise<PrescriptionOutput>;

  //generate prescription output
  generatePrescriptionOutput(
    prescriptionID: number
  ): Promise<PrescriptionOutput>;
}

class PrescriptionService implements PrescriptionServiceInterface {
  //get DoctorInfo and PatientInfo parallelly
  async getDoctorAndPatientInfo(
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

  async getDoctorInformation(doctorID: number): Promise<DoctorPortion> {
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

  async getPatientInformation(patientID: number): Promise<PatientPortion> {
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

  async getAllMedicineInfos(brandIDs: number[]): Promise<BrandInfo[]> {
    const brandInfos: BrandInfo[] = [];

    for (const brandID of brandIDs) {
      const brandInfo = await this.getSingleMedicineInfo(brandID);
      brandInfos.push(brandInfo);
    }

    return brandInfos;
  }

  async getSingleMedicineInfo(brandID: number): Promise<BrandInfo> {
    const payload: RPC_Request_Payload = {
      type: "GET_BRANDINFO_BY_ID",
      data: {
        brandID,
      },
    };

    log.debug(payload, "payload - for 'GET_BRANDINFO_BY_ID'");

    try {
      const medicine_response_payload: RPC_Response_Payload =
        await broker.RPC_Request(config.MEDICINE_RPC_QUEUE, payload);

      log.debug(
        medicine_response_payload,
        "respnse payload - for 'GET_BRANDINFO_BY_ID'"
      );

      if (medicine_response_payload.status !== "success")
        throw createHttpError(
          500,
          "Error getting medicine information from RPC"
        );

      return { ...medicine_response_payload.data } as BrandInfo;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error getting medicine information from RPC");
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
        OldAppointments: await appointmentService.Get_Other_Appointments(
          appointment.olderAppointmentIDs
        ),
        SharedAppointments: await appointmentService.Get_Other_Appointments(
          appointment.otherAppointmentIDs
        ),
      };
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async createPrescription(
    input: CreatePrescriptionInput
  ): Promise<PrescriptionOutput> {
    try {
      const newPrescription = await prescriptionRepository.createPrescription(
        input
      );

      if (!newPrescription)
        throw createHttpError(500, "Error creating prescription in database");

      const prescriptionOutput = await this.generatePrescriptionOutput(
        newPrescription.id
      );

      if (!prescriptionOutput)
        throw createHttpError(500, "Error generating prescription output");

      return prescriptionOutput;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  // ---------------------- Get Prescription ---------------------- //
  async getPrescription(appointmentID: number): Promise<PrescriptionOutput> {
    try {
      const prescription =
        await prescriptionRepository.getPrescription_fromAppointmentID(
          appointmentID
        );

      if (!prescription) throw createHttpError(404, "Prescription not found");

      const prescriptionOutput = await this.generatePrescriptionOutput(
        prescription.id
      );

      if (!prescriptionOutput)
        throw createHttpError(500, "Error generating prescription output");

      return prescriptionOutput;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async generatePrescriptionOutput(
    prescriptionID: number
  ): Promise<PrescriptionOutput> {
    try {
      const prescription =
        await prescriptionRepository.getPrescription_fromPrescriptionID(
          prescriptionID
        );

      if (!prescription) throw createHttpError(404, "Prescription not found");

      const prescriptionHeader = await this.generatePrescriptionHeader(
        null,
        prescriptionID
      );

      if (!prescriptionHeader)
        throw createHttpError(500, "Error generating prescription header");

      const prescription_medicines =
        await prescription.getPrescription_Medicines();

      if (!prescription_medicines)
        throw createHttpError(
          500,
          "Error getting prescription_medicines from database"
        );

      const medicineIDs = prescription_medicines.map(
        (prescription_medicine) => prescription_medicine.medicineID
      );

      const brandInfos = await this.getAllMedicineInfos(medicineIDs);

      return {
        Header: prescriptionHeader,
        Medicines: brandInfos,
        ...prescription.dataValues,
      };
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}

export default new PrescriptionService();
