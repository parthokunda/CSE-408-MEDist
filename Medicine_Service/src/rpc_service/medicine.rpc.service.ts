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
      status: "unauthorized",
      data: {},
    };
    log.info(payload, "received payload");
    switch (payload.type) {
      case "GET_BRANDINFO_BY_ID":
        try {
          const brandInfo =
            await dbService.brandService.getBrandById_withoutDescription(
              Number(payload.data["brandID"])
            );
          if (!brandInfo) throw new Error("Brand not found");

          response.status = "success";
          response.data = brandInfo;
        } catch (err) {
          log.error(err.message);
          response.status = "error";
          response.data["error"] = err.message;
        }

      default:
        return response;
    }
  }
}

export default new MedicineRPCService();
