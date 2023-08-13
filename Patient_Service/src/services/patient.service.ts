// external imports
import createHttpError from "http-errors";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import multer from "multer";

//internal imports
import patientRepository, {
  PatientRepositoryInterface,
} from "../database/repository/patient.repository";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import { config } from "../config";
import Patient, { UpdatePatientInfo } from "../database/models/Patient.model";

//Initialize a firebase application
initializeApp(config.FIREBASE_CONFIG);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage();
// Setting up multer as a middleware to grab photo uploads
const upload = multer({ storage: multer.memoryStorage() });

export interface PatientServiceInterface {
  createInitialPatient(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;

  //get patient info
  getPatientInfo(patientID: number): Promise<Patient>;

  //update patient info
  updatePatientInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<Patient>;
}

class PatientService implements PatientServiceInterface {
  private repository: PatientRepositoryInterface;

  constructor() {
    this.repository = patientRepository;
  }

  // ----------------------------------------- Create Initial Patient ------------------------------------------ //
  async createInitialPatient(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id: patientID, status: profile_status } =
        await this.repository.createPatient_byUserId(userID);

      return {
        status: "success",
        data: {
          ID: patientID,
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

  // ----------------------------------------- Get ID given UserID ------------------------------------------ //
  async getId_givenUserID(userID: number): Promise<RPC_Response_Payload> {
    try {
      const { id, status } = await this.repository.getId_givenUserID(userID);

      const patientID = id;
      const profile_status = status;

      if (isNaN(patientID)) {
        return {
          status: "not_found",
          data: {},
        };
      }

      return {
        status: "success",
        data: {
          ID: patientID,
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
  async serveRPCRequest(payload: RPC_Request_Payload) {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };
    switch (payload.type) {
      case "CREATE_NEW_ENTITY":
        return await this.createInitialPatient(payload.data["userID"]);

      case "GET_ID":
        return await this.getId_givenUserID(payload.data["userID"]);
      default:
        break;
    }

    return response;
  }

  // ----------------------------------------- Get Patient Info ------------------------------------------ //
  async getPatientInfo(patientID: number): Promise<Patient> {
    try {
      const patient = await patientRepository.getPatientInfo(patientID);

      return patient;
    } catch (error) {
      throw error;
    }
  }

  // ----------------------------------------- Update Patient Info ------------------------------------------ //
  async updatePatientInfo(
    patientID: number,
    newPatientInfo: Partial<Patient>
  ): Promise<Patient> {
    try {
      // if newPatientInfo contains id, userID, status remove them
      if (newPatientInfo.id) delete newPatientInfo.id;
      if (newPatientInfo.userID) delete newPatientInfo.userID;
      if (newPatientInfo.status) delete newPatientInfo.status;

      const patient = await patientRepository.updatePatientInfo(
        patientID,
        newPatientInfo
      );

      return patient;
    } catch (error) {
      throw error;
    }
  }
}

export default new PatientService();
