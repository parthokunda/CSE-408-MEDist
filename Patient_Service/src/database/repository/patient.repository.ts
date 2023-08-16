//import patient model
import Patient from "../models/Patient.model";

//internal imports
import { PatientStatus } from "../models/Patient.model";

export interface PatientRepositoryInterface {
  // during registration and login
  createPatient_byUserId(
    userID: number
  ): Promise<{ id: number; status: string }>;
  getId_givenUserID(userID: number): Promise<{ id: number; status: string }>;

  // get patient info
  getPatientInfo(patientID: number): Promise<Patient>;

  // update info
  updatePatientInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<Patient>;
}

class PatientRepository implements PatientRepositoryInterface {
  async createPatient_byUserId(
    userID: number
  ): Promise<{ id: number; status: string }> {
    try {
      const patient = await Patient.create({
        userID: userID,
      });

      return {
        id: patient.id,
        status: patient.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async getId_givenUserID(
    userID: number
  ): Promise<{ id: number; status: string }> {
    const patient = await Patient.findOne({
      where: {
        userID: userID,
      },
    });

    if (patient)
      return {
        id: patient.id,
        status: patient.status,
      };
    else
      return {
        id: NaN,
        status: "",
      };
  }

  async getPatientInfo(patientID: number): Promise<Patient> {
    try {
      const patient = await Patient.findByPk(patientID);

      if (patient) return patient;
      else throw new Error("Patient not found");
    } catch (error) {
      throw error;
    }
  }

  async updatePatientInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<Patient> {
    try {
      await Patient.update(newPatientInfo, {
        where: {
          id: patientID,
        },
      });

      let updatedPatient = await Patient.findByPk(patientID);

      if (updatedPatient) {
        updatedPatient.status = PatientStatus.FULLY_REGISTERED;
        updatedPatient = await updatedPatient.save();

        return updatedPatient;
      } else throw new Error("Patient not found");
    } catch (error) {
      throw error;
    }
  }
}

export default new PatientRepository();
