//external imports
import createHttpError from "http-errors";
import { Op } from "sequelize";

// internal imports
import log from "../../utils/logger";

// import models
import {
  Prescription,
  Appointment,
  Prescription_Medicine_Input,
  Prescription_Medicines,
  PrescriptionOutput,
  AppointmentStatus,
} from "../models";

export interface CreatePrescriptionInput {
  appointmentID: number;
  doctorID: number;

  medicines: Prescription_Medicine_Input[];
  symptoms: string[];
  diagnosis: string[];
  advices: string[];
  meetAfter: number | null;
  otherNotes: string[] | null;
  past_history: string[] | null;
  test: string[] | null;
}

export interface Prescription_Repository_Interface {
  //get Appointment from prescription
  getAppointment_fromPrescriptionID(
    prescriptionID: number
  ): Promise<Appointment>;

  // get prescription
  getPrescription_fromPrescriptionID(
    prescriptionID: number
  ): Promise<Prescription>;
  getPrescription_fromAppointmentID(
    appointmentID: number
  ): Promise<Prescription | null>;

  //create prescription
  createPrescription(input: CreatePrescriptionInput): Promise<Prescription>;

  //updatePrescription - downloadURL
  updatePrescription_downloadURL(
    prescriptionID: number,
    downloadURL: string
  ): Promise<void>;
}

class PrescriptionRepository implements Prescription_Repository_Interface {
  private async addMedicines(
    prescription: Prescription,
    medicines: Prescription_Medicine_Input[]
  ): Promise<void> {
    try {
      for (let i = 0; i < medicines.length; i++) {
        const prescription_medicine = await Prescription_Medicines.create({
          ...medicines[i],
          prescriptionID: prescription.id,
        });

        if (!prescription_medicine)
          throw createHttpError(500, "Error adding medicines to prescription");

        await prescription_medicine.setPrescription(prescription);
        await prescription.addPrescription_Medicines(prescription_medicine);
      }
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error adding medicines to prescription");
    }
  }

  // ---------------------- Get Appointment ---------------------- //
  async getAppointment_fromPrescriptionID(
    prescriptionID: number
  ): Promise<Appointment> {
    try {
      const prescription = await Prescription.findByPk(prescriptionID);

      if (!prescription) throw createHttpError(404, "Prescription not found");

      const appointment = await prescription.getAppointment();

      if (!appointment) throw createHttpError(404, "Appointment not found");

      return appointment;
    } catch (error) {
      log.error(error);
      throw createHttpError(
        500,
        "Error getting appointment from prescription from database"
      );
    }
  }

  // ---------------------- Get Prescription ---------------------- //
  async getPrescription_fromPrescriptionID(
    prescriptionID: number
  ): Promise<Prescription> {
    try {
      const prescription = await Prescription.findByPk(prescriptionID);
      if (!prescription) throw createHttpError(404, "Prescription not found");
      return prescription;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error getting prescription from database");
    }
  }

  async getPrescription_fromAppointmentID(
    appointmentID: number
  ): Promise<Prescription | null> {
    try {
      const appointment = await Appointment.findByPk(appointmentID);

      if (!appointment) throw createHttpError(404, "Appointment not found");

      const prescription = await appointment.getPrescription();

      if (!prescription) return null;

      return prescription;
    } catch (error) {
      log.error(error);
      throw createHttpError(
        500,
        "Error getting prescription from appointment from database"
      );
    }
  }
  // ---------------------- Create Prescription ---------------------- //
  async createPrescription(
    input: CreatePrescriptionInput
  ): Promise<Prescription> {
    try {
      // get appointment
      const appointment = await Appointment.findByPk(input.appointmentID);

      if (!appointment) {
        throw createHttpError.NotFound("Appointment not found");
      }

      if (appointment.status !== AppointmentStatus.PENDING)
        throw createHttpError.NotAcceptable(
          "Appointment is not in pending status. Cannot create prescription"
        );

      if (appointment.doctorID !== input.doctorID)
        throw createHttpError.Unauthorized(
          "You are not authorized to create prescription for this appointment"
        );

      const prescription = await Prescription.create({
        appointmentID: input.appointmentID,
        symptoms: input.symptoms,
        diagnosis: input.diagnosis,
        advices: input.advices,
        meetAfter: input.meetAfter,
        otherNotes: input.otherNotes,
        past_history: input.past_history,
        test: input.test,
      });

      if (!prescription)
        throw createHttpError(500, "Error creating prescription");

      appointment.prescriptionID = prescription.id;
      appointment.status = AppointmentStatus.PRESCRIBED;
      await appointment.save();

      await appointment.setPrescription(prescription);
      await prescription.setAppointment(appointment);

      // add medicines
      try {
        await this.addMedicines(prescription, input.medicines);
      } catch (error) {
        log.error(error);

        const existingMedicines =
          await prescription.getPrescription_Medicines();

        if (existingMedicines) {
          await Promise.all(
            existingMedicines.map(async (medicine) => {
              await medicine.destroy();
            })
          );
        }

        await prescription.destroy();
        throw createHttpError(
          500,
          "Error adding medicines to prescription. prescription deleted. medicines also deleted"
        );
      }

      // this return type will be changed
      return prescription;
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error creating prescription");
    }
  }

  // ---------------------- Update Prescription ---------------------- //
  async updatePrescription_downloadURL(
    prescriptionID: number,
    downloadURL: string
  ): Promise<void> {
    try {
      const prescription = await Prescription.findByPk(prescriptionID);

      if (!prescription)
        throw createHttpError.NotFound("Prescription not found");

      prescription.downloadLink = downloadURL;
      await prescription.save();
    } catch (error) {
      log.error(error);
      throw createHttpError(500, "Error updating prescription downloadURL");
    }
  }
}

export default new PrescriptionRepository();
