//import patient model
import Patient from "../models/Patient.model";

//internal imports


export interface PatientRepositoryInterface {
  createPatient_byUserId(userID: number): Promise<number>;
  getId_givenUserID(userID: number): Promise<number>;
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
}

export default new PatientRepository();
