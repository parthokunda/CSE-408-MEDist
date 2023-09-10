// external imports
import createHttpError from "http-errors";
import htmlPdf from "puppeteer-html-pdf";
import fs from "fs";
import ejs from "ejs";
import { initializeApp } from "firebase/app";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

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
import path from "path";

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

  //create prescription pdf
  createPrescriptionPdf(
    appointmentID: number,
    prescription: PrescriptionOutput
  ): Promise<void>;

  //upload prescription pdf and get download url
  uploadPrescriptionPdf_and_getDownLoadlink(
    appointmentID: number
  ): Promise<string>;

  //get prescriptionPDF download link
  getPrescriptionPDFDownloadLink(appointmentID: number): Promise<string>;
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
          doctorID: doctorID,
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
          patientID: patientID,
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

      return {
        ...patient_response_payload.data["resultData"],
      } as PatientPortion;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error getting patient information from RPC");
    }
  }

  async getAllMedicineInfos(brandIDs: number[]): Promise<BrandInfo[]> {
    const brandInfos: BrandInfo[] = [];

    for (const brandID of brandIDs) {
      const brandInfo = await this.getSingleMedicineInfo(brandID);
      brandInfos.push({ ...brandInfo, dosage: "", when: "", duration: 0 });
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
            prescriptionID as number
          );
      } else {
        appointment = await appointmentRepository.Get_AppointmentInfo(
          appointmentID
        );
      }

      if (!appointment) throw createHttpError(404, "Appointment not found");

      log.info(appointment, "appointment");

      const doctorID = appointment.doctorID;
      const patientID = appointment.patientID;

      log.info(doctorID, "doctorID");
      log.info(patientID, "patientID");


      const tempPatientInfo = await this.getPatientInformation(patientID);

      log.info(tempPatientInfo, "tempPatientInfo");

      const { DoctorInfo, PatientInfo } = await this.getDoctorAndPatientInfo(
        doctorID,
        patientID
      );

      const olderAppointmentIDs =
        await appointmentRepository.getOldAppointmentIDs(appointment);

      return {
        DoctorPortionInfo: DoctorInfo,
        PatientPortionInfo: PatientInfo,
        AppointmentPortionInfo: {
          id: appointment.id,
          type: appointment.type,
          time: appointment.startTime,
          status: appointment.status,
        },
        OldAppointments: await appointmentService.Get_Other_Appointments(
          olderAppointmentIDs
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

      let prescriptionOutput = await this.generatePrescriptionOutput(
        newPrescription.id
      );

      if (!prescriptionOutput)
        throw createHttpError(500, "Error generating prescription output");

      await this.createPrescriptionPdf(input.appointmentID, prescriptionOutput);

      const downloadURL = await this.uploadPrescriptionPdf_and_getDownLoadlink(
        input.appointmentID
      );

      if (!downloadURL)
        throw createHttpError(500, "Error uploading prescription pdf");

      await prescriptionRepository.updatePrescription_downloadURL(
        newPrescription.id,
        downloadURL
      );

      prescriptionOutput.downloadLink = downloadURL;

      return prescriptionOutput;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async createPrescriptionPdf(
    appointmentID: number,
    prescription: PrescriptionOutput
  ): Promise<void> {
    try {
      const filePath = path.resolve(__dirname, "../pdfTemplate/template.ejs");

      const htmlString = fs.readFileSync(filePath).toString();

      const ejsData = await ejs.render(htmlString, { ...prescription });

      const options = {
        format: "Letter",
        ImageType: "png",
        printBackground: true,
        path: path.resolve(__dirname, `../pdfs/${appointmentID}.pdf`),
        preferCSSPageSize: false,
      };

      await htmlPdf.create(ejsData, options);
    } catch (error) {
      log.error(error);
      throw error;
    }
  }

  async uploadPrescriptionPdf_and_getDownLoadlink(
    appointmentID: number
  ): Promise<string> {
    try {
      const pdfPath = path.resolve(__dirname, `../pdfs/${appointmentID}.pdf`);

      const firebaseApp = initializeApp(config.FIREBASE_CONFIG);

      const storage = getStorage(firebaseApp);

      const storageRef = ref(storage, `prescriptions/${appointmentID}.pdf`);

      const uploadTask = uploadBytesResumable(
        storageRef,
        fs.readFileSync(pdfPath)
      );

      await uploadTask;

      const downloadURL = await getDownloadURL(storageRef);

      //now delete the pdf file
      fs.unlinkSync(pdfPath);

      return downloadURL;
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

      if (!prescription) {
        const prescriptionHeader = await this.generatePrescriptionHeader(
          appointmentID,
          null
        );
        if (!prescriptionHeader)
          throw createHttpError(500, "Error generating prescription header");
        return {
          Header: prescriptionHeader,
          Medicines: [],
        };
      }

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

      log.info(prescriptionID, "prescriptionID");
      log.info(prescription, "prescription");

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

      let brandInfos = await this.getAllMedicineInfos(medicineIDs);

      for (let i = 0; i < brandInfos.length; i++) {
        brandInfos[i].dosage = prescription_medicines[i].dosage;
        brandInfos[i].when = prescription_medicines[i].when;
        brandInfos[i].duration = Number(prescription_medicines[i].duration);
      }

      if(!prescription.downloadLink){
        const downloadURL = await this.uploadPrescriptionPdf_and_getDownLoadlink(
          prescription.appointmentID
        );

        if (!downloadURL)
          throw createHttpError(500, "Error uploading prescription pdf");

        await prescriptionRepository.updatePrescription_downloadURL(
          prescription.id,
          downloadURL
        );
      }

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

  // ---------------------- Get Prescription PDF Download Link ---------------------- //
  async getPrescriptionPDFDownloadLink(appointmentID: number): Promise<string> {
    try {
      const prescription =
        await prescriptionRepository.getPrescription_fromAppointmentID(
          appointmentID
        );

      if (!prescription) throw createHttpError(404, "Prescription not found");

      if (prescription.downloadLink) return prescription.downloadLink;

      const prescriptionOutput = await this.generatePrescriptionOutput(
        prescription.id
      );

      if (!prescriptionOutput)
        throw createHttpError(500, "Error generating prescription output");

      log.info(prescriptionOutput, "prescriptionOutput");

      await this.createPrescriptionPdf(appointmentID, prescriptionOutput);

      const downloadURL = await this.uploadPrescriptionPdf_and_getDownLoadlink(
        appointmentID
      );

      if (!downloadURL)
        throw createHttpError(500, "Error uploading prescription pdf");

      await prescriptionRepository.updatePrescription_downloadURL(
        prescription.id,
        downloadURL
      );

      return downloadURL;
    } catch (error) {
      log.error(error);
      throw error;
    }
  }
}

export default new PrescriptionService();
