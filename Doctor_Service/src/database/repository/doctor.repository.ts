//import models
import Specialization from "../models/Specialization.model";
import { Doctor } from "../models";

// internal imports
import {
  DoctorOverviewInfo,
  DoctorStatus,
  SearchDoctorInfo,
} from "../models/Doctor.model";
import createHttpError from "http-errors";
import { Op } from "sequelize";

export interface searchQuery_and_Params {
  doctorName: string;
  specializationID: number;
  pagination: number;
  currentPage: number;
}

export interface Doctor_Repository_Interface {
  // during registration and login
  createDoctor_byUserId(
    userID: number
  ): Promise<{ id: number; status: string }>;

  getId_givenUserID(userID: number): Promise<{ id: number; status: string }>;

  // additional info
  getDoctorInfo(doctorID: number): Promise<Doctor>;
  updateDoctorAdditionalInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<Doctor>;

  // search doctor
  searchDoctor(
    searchInfo: searchQuery_and_Params
  ): Promise<{ doctors: Doctor[]; totalCount: number }>;
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

  // ----------------- Additional Info -----------------

  // get doctor additional info
  async getDoctorInfo(doctorID: number): Promise<Doctor> {
    try {
      const doctor = await Doctor.findByPk(doctorID);
      if (doctor) return doctor;
      else throw createHttpError.NotFound("Doctor not found.");
    } catch (error) {
      throw error;
    }
  }

  // update info
  async updateDoctorAdditionalInfo(
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

  // ----------------- Search Doctor -----------------
  async searchDoctor(
    searchInfo: searchQuery_and_Params
  ): Promise<{ doctors: Doctor[]; totalCount: number }> {
    try {
      const itemsPerPage = searchInfo.pagination;
      const currentPage = searchInfo.currentPage;
      const offset = (currentPage - 1) * itemsPerPage;

      let doctors: Doctor[];
      let totalCount: number;

      if (searchInfo.doctorName === "" && searchInfo.specializationID === -1) {
        doctors = await Doctor.findAll({
          offset,
          limit: itemsPerPage,
        });

        totalCount = await Doctor.count();
      } else if (
        searchInfo.doctorName === "" &&
        searchInfo.specializationID !== -1
      ) {
        doctors = await Doctor.findAll({
          where: {
            specializationID: searchInfo.specializationID,
          },
          offset,
          limit: itemsPerPage,
        });

        totalCount = await Doctor.count({
          where: {
            specializationID: searchInfo.specializationID,
          },
        });
      } else if (
        searchInfo.doctorName !== "" &&
        searchInfo.specializationID === -1
      ) {
        doctors = await Doctor.findAll({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `${searchInfo.doctorName}%`, // case insensitive starts with search
                },
              },
              {
                name: {
                  [Op.iLike]: `%${searchInfo.doctorName}%`, // case insensitive contains search
                },
              },
            ],
          },
          offset,
          limit: itemsPerPage,
        });

        totalCount = await Doctor.count({
          where: {
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `${searchInfo.doctorName}%`, // case insensitive starts with search
                },
              },
              {
                name: {
                  [Op.iLike]: `%${searchInfo.doctorName}%`, // case insensitive contains search
                },
              },
            ],
          },
        });
      } else {
        doctors = await Doctor.findAll({
          where: {
            specializationID: searchInfo.specializationID,
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `${searchInfo.doctorName}%`, // case insensitive starts with search
                },
              },
              {
                name: {
                  [Op.iLike]: `%${searchInfo.doctorName}%`, // case insensitive contains search
                },
              },
            ],
          },
          offset,
          limit: itemsPerPage,
        });

        totalCount = await Doctor.count({
          where: {
            specializationID: searchInfo.specializationID,
            [Op.or]: [
              {
                name: {
                  [Op.iLike]: `${searchInfo.doctorName}%`, // case insensitive starts with search
                },
              },
              {
                name: {
                  [Op.iLike]: `%${searchInfo.doctorName}%`, // case insensitive contains search
                },
              },
            ],
          },
        });
      }

      return {
        doctors,
        totalCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorRepository();
