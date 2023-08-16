// external imports
import createHttpError from "http-errors";

// internal imports
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// import models
import Doctor, { DoctorAttributes } from "../database/models/Doctor.model";

// repository instance
import doctorRepository from "../database/repository/doctor.repository";
import specializationRepository from "../database/repository/specialization.repository";

export interface DoctorProfileInfo {
  DoctorInfo: DoctorAttributes;
  Specialization: string;
}

export interface DoctorOverviewInfo {
  doctorID: number;
  name: string;
}

export interface DoctorServiceInterface {
  // during registration and login
  createInitialDoctor(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;

  // after registration and login
  getDoctorInfo(doctorID: number): Promise<DoctorProfileInfo>;
  updateDoctorInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorProfileInfo>;
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

  // ----------------- server side RPC request handler ----------------
  async serveRPCRequest(
    payload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };

    switch (payload.type) {
      case "CREATE_NEW_ENTITY":
        return await this.createInitialDoctor(payload.data["userID"]);

      case "GET_ID":
        return await this.getId_givenUserID(payload.data["userID"]);

      default:
        return response;
    }
  }

  // ----------------- after registration and login -----------------
  async getDoctorInfo(doctorID: number): Promise<DoctorProfileInfo> {
    try {
      const doctor = await doctorRepository.getDoctorInfo(doctorID);

      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctor,
        Specialization: specialization.name,
      };
    } catch (error) {
      throw error;
    }
  }

  async updateDoctorInfo(
    doctorID: number,
    newDoctorInfo: Partial<Doctor>
  ): Promise<DoctorProfileInfo> {
    try {
      if (newDoctorInfo.id) delete newDoctorInfo.id;
      if (newDoctorInfo.userID) delete newDoctorInfo.userID;
      if (newDoctorInfo.status) delete newDoctorInfo.status;

      const doctor = await doctorRepository.updateDoctorInfo(
        doctorID,
        newDoctorInfo
      );
      const specialization = await doctor.getSpecialization();

      return {
        DoctorInfo: doctor,
        Specialization: specialization.name,
      };
    } catch (error) {
      throw error;
    }
  }
}

export default new DoctorService();
