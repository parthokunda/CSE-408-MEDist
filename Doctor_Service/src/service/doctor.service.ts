// external imports
import createHttpError from "http-errors";

// internal imports
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

import {
  DoctorAdditionalInfo,
  DoctorAdditionalInfo_Excluded_Properties,
  DoctorOverviewInfo,
  DoctorOverviewInfo_Excluded_Properties,
  DoctorProfileInfo,
  SearchDoctorInfo,
} from "../database/models/Doctor.model";

import { excludeProperties } from "../utils/necessary_functions";

// import models
import { Doctor } from "../database/models";

// repository instance
import { doctorRepository } from "../database/repository";
import { searchQuery_and_Params } from "../database/repository/doctor.repository";
import log from "../utils/logger";

export interface DoctorServiceInterface {
  // during registration and login
  createInitialDoctor(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  getEmailandName_givenID(doctorID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;

  // after registration and login
  getDoctorAdditionalInfo(doctorID: number): Promise<DoctorAdditionalInfo>;
  updateDoctorAdditionalInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorAdditionalInfo>;

  // after full registration
  getDoctorOverviewInfo(doctorID: number): Promise<DoctorOverviewInfo>;
  getDoctorProfileInfo(doctorID: number): Promise<DoctorProfileInfo>;

  // search doctor
  searchDoctor(searchInfo: searchQuery_and_Params): Promise<SearchDoctorInfo>;
}

class DoctorService implements DoctorServiceInterface {
  // ----------------- during registration and login -----------------
  async createInitialDoctor(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: doctorID, status: profile_status } =
        await doctorRepository.createDoctor_byUserId(userID);

      return {
        status: "success",
        data: {
          ID: doctorID,
          profile_status,
        },
      };
    } catch (error) {
      return {
        status: "duplicate_error",
        data: {},
      };
    }
  }

  async getId_givenUserID(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: doctorID, status: profile_status } =
        await doctorRepository.getId_givenUserID(userID);

      if (isNaN(doctorID)) {
        return {
          status: "not_found",
          data: {},
        };
      }

      return {
        status: "success",
        data: {
          ID: doctorID,
          profile_status,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  async getEmailandName_givenID(
    doctorID: number
  ): Promise<RPC_Response_Payload> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      return {
        status: "success",
        data: {
          email: doctor.email,
          name: doctor.name,
        },
      };
    } catch (error) {
      return {
        status: "error",
        data: {},
      };
    }
  }

  // ----------------- server side RPC request handler ----------------
  async serveRPCRequest(
    payload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };
    log.info(payload, "received payload");
    switch (payload.type) {
      case "CREATE_NEW_ENTITY":
        return await this.createInitialDoctor(payload.data["userID"]);

      case "GET_ID":
        return await this.getId_givenUserID(payload.data["userID"]);

      case "GET_EMAIL_AND_NAME_FROM_ID":
        return await this.getEmailandName_givenID(
          Number(payload.data["doctorID"])
        );

      default:
        return response;
    }
  }

  // ----------------- after registration and login -----------------

  async getDoctorAdditionalInfo(
    doctorID: number
  ): Promise<DoctorAdditionalInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);
      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorAdditionalInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDoctorAdditionalInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorAdditionalInfo> {
    try {
      if (newDoctorInfo.id) delete newDoctorInfo.id;
      if (newDoctorInfo.userID) delete newDoctorInfo.userID;
      if (newDoctorInfo.status) delete newDoctorInfo.status;
      if (newDoctorInfo.scheduleID) delete newDoctorInfo.scheduleID;

      const doctor = await doctorRepository.updateDoctorAdditionalInfo(
        doctorID,
        newDoctorInfo
      );

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorAdditionalInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- after full registration -----------------

  // get doctor's overview info
  async getDoctorOverviewInfo(doctorID: number): Promise<DoctorOverviewInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      const doctorInfo = excludeProperties(
        doctor.dataValues,
        DoctorOverviewInfo_Excluded_Properties
      );

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctorInfo,
        Specialization: specialization?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  // get doctor's profile info
  async getDoctorProfileInfo(doctorID: number): Promise<DoctorProfileInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);
      const specialization = await doctor.getSpecialization();
      const onlineSchedule = await doctor.getOnlineSchedule();

      return {
        DoctorInfo: doctor.dataValues,
        Specialization: specialization?.dataValues || {},
        OnlineSchedule: onlineSchedule?.dataValues || {},
      };
    } catch (error) {
      throw error;
    }
  }

  // ----------------- search doctor -----------------
  async searchDoctor(
    searchInfo: searchQuery_and_Params
  ): Promise<SearchDoctorInfo> {
    try {
      const { doctors, totalCount } = await doctorRepository.searchDoctor(
        searchInfo
      );

      const doctorOverviews = await doctors.map(async (doctor) => {
        const doctorInfo = excludeProperties(
          doctor.dataValues,
          DoctorOverviewInfo_Excluded_Properties
        );

        const specialization = await doctor.getSpecialization();

        return {
          DoctorInfo: doctorInfo,
          Specialization: specialization?.dataValues || {},
        };
      });

      return {
        Doctors: await Promise.all(doctorOverviews),
        totalCount,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorService();
