//import patient model
import Patient, { UpdatePatientInfo } from "../models/Patient.model";

//internal imports
import { PatientStatus } from "../models/Patient.model";

export interface PatientRepositoryInterface {
  // during registration and login
  createPatient_byUserId(userID: number): Promise<number>;
  getId_givenUserID(userID: number): Promise<number>;

  // during update
  updatePatientInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<Patient>;
}

class PatientRepository implements PatientRepositoryInterface {
  async createPatient_byUserId(userID: number): Promise<number> {
    try {
      const patient = await Patient.create({
        userID: userID,
      });

      return patient.id;
    } catch (error) {
      throw error;
    }
  }

  async getId_givenUserID(userID: number): Promise<number> {
    const patient = await Patient.findOne({
      where: {
        userID: userID,
      },
    });

    if (patient) return patient.id;
    else return NaN;
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
