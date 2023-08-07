// external imports
import createHttpError from "http-errors";

//internal imports
import patientRepository, {
  PatientRepositoryInterface,
} from "../database/repository/patient.repository";
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";
import { config } from "../config";


export interface PatientServiceInterface {
  createInitialPatient(userID: number): Promise<RPC_Response_Payload>;
  getId_givenUserID(userID: number): Promise<RPC_Response_Payload>;
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
}

class PatientService implements PatientServiceInterface {
  private repository: PatientRepositoryInterface;

  constructor() {
    this.repository = patientRepository;
  }

  // ----------------------------------------- Create Initial Patient ------------------------------------------ //
  async createInitialPatient(userID: number): Promise<RPC_Response_Payload> {
    try {
      const patientID = await this.repository.createPatient_byUserId(userID);

      return {
        status: "success",
        data: {
          ID: patientID,
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
      const patientID = await this.repository.getId_givenUserID(userID);

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
}

export default new PatientService();
