//import models
import Specialization from "../models/Specialization.model";
import Doctor from "../models/Doctor.model";

// internal imports
import { DoctorStatus } from "../models/Doctor.model";

export interface Doctor_Repository_Interface {
  // during registration and login
  createDoctor_byUserId(
    userID: number
  ): Promise<{ id: number; status: string }>;

  getId_givenUserID(userID: number): Promise<{ id: number; status: string }>;

  // after registration and login
  getDoctorInfo(doctorID: number): Promise<Doctor>;
  updateDoctorInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<Doctor>;
}

class DoctorRepository implements Doctor_Repository_Interface {
  // ----------------- during registration and login -----------------
  async createDoctor_byUserId(
    userID: number
  ): Promise<{ id: number; status: string }> {
    try {
      const doctor = await Doctor.create({
        userID: userID,
      });

      return {
        id: doctor.id,
        status: doctor.status,
      };
    } catch (error) {
      throw error;
    }
  }

  async getId_givenUserID(
    userID: number
  ): Promise<{ id: number; status: string }> {
    try {
      const doctor = await Doctor.findOne({
        where: {
          userID: userID,
        },
      });

      if (doctor)
        return {
          id: doctor.id,
          status: doctor.status,
        };
      else
        return {
          id: NaN,
          status: "",
        };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- after registration and login -----------------

  // get doctor info
  async getDoctorInfo(doctorID: number): Promise<Doctor> {
    try {
      const doctor = await Doctor.findByPk(doctorID);

      if (doctor) return doctor;
      else throw new Error("Doctor not found.");
    } catch (error) {
      throw error;
    }
  }

  // update info
  async updateDoctorInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<Doctor> {
    try {
      const doctor = await Doctor.findByPk(doctorID);

      if (doctor) {
        // check if there is any specialization
        if (newDoctorInfo.specializationID) {
          const specialization = await Specialization.findByPk(
            newDoctorInfo.specializationID
          );

          if (specialization) {
            await doctor.setSpecialization(specialization);
            await specialization.addDoctor(doctor);
          } else throw new Error("Specialization not found.");
        }
        await doctor.update(newDoctorInfo);
        return doctor;
      } else throw new Error("Doctor not found.");
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorRepository();
