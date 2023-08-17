// external imports
import createHttpError from "http-errors";

// import models
import Specialization, {
  SpecializationAttributes,
} from "../database/models/Specialization.model";

// repository instance
import specializationRepository from "../database/repository/specialization.repository";
import {
  DoctorOverviewInfo,
  DoctorOverviewInfo_Excluded_Properties,
} from "../database/models/Doctor.model";
import { excludeProperties } from "../utils/necessary_functions";

export interface SingleSpecialization {
  Specialization: SpecializationAttributes;
  Doctors: DoctorOverviewInfo[];
}

export interface SpecializationServiceInterface {
  getSpecializationList(): Promise<Specialization[]>;
  getSpecializationList_byName(
    specializationName: string
  ): Promise<Specialization[]>;

  getSpecialization(specializationID: number): Promise<SingleSpecialization>;
}

class SpecializationService implements SpecializationServiceInterface {
  // ----------------------------------------- Get Specialization List ------------------------------------------ //
  async getSpecializationList(): Promise<Specialization[]> {
    try {
      const specializationList =
        await specializationRepository.getAllSpecializations();
      return specializationList;
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------- Get Specialization List by Name ------------------------------------------ //
  async getSpecializationList_byName(
    specializationName: string
  ): Promise<Specialization[]> {
    try {
      const specializationList =
        await specializationRepository.searchSpecialization(specializationName);
      return specializationList;
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------- Get Specialization ------------------------------------------ //
  async getSpecialization(
    specializationID: number
  ): Promise<SingleSpecialization> {
    try {
      const specialization = await specializationRepository.getSpecialization(
        specializationID
      );
      const doctors = await specialization.getDoctors();

      const doctorsOverview: DoctorOverviewInfo[] = doctors.map((doctor) => {
        const doctorInfo = excludeProperties(
          doctor.dataValues,
          DoctorOverviewInfo_Excluded_Properties
        );
        return {
          DoctorInfo: doctorInfo,
          Specialization: specialization.dataValues,
        };
      });

      return {
        Specialization: specialization.dataValues,
        Doctors: doctorsOverview,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new SpecializationService();
