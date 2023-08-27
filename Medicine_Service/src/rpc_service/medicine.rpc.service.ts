// internal imports
import broker, {
  RPC_Request_Payload,
  RPC_Response_Payload,
} from "../utils/broker";

// dbService instance
import dbService from "../database/services/service";
import log from "../utils/logger";

export interface MedicineRPCServiceInterface {
  serveRPCRequest(payload: RPC_Request_Payload): Promise<RPC_Response_Payload>;
}

class MedicineRPCService implements MedicineRPCServiceInterface {
  async serveRPCRequest(
    payload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    let response: RPC_Response_Payload = {
      status: "error",
      data: {},
    };
    log.info(payload, "received payload");
    switch (payload.type) {
      default:
        return response;
    }
  }
}

export default new MedicineRPCService();
