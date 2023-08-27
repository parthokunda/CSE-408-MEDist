// external imports
import amqplib, { Connection, Channel, Message } from "amqplib";
import { v4 as uuidv4 } from "uuid";

// internal imports
import { config } from "../config";
import log from "./logger";
import { MedicineRPCServiceInterface } from "rpc_service/medicine.rpc.service";

export interface RPC_Request_Payload {
  type: string;
  data: object;
}

export interface RPC_Response_Payload {
  status:
    | "success"
    | "error"
    | "not_found"
    | "unauthorized"
    | "duplicate_error";
  data: object;
}

export interface BrokerServiceInterface {
  RPC_Observer(userService: MedicineRPCServiceInterface): Promise<void>;
}

class BrokerService implements BrokerServiceInterface {
  private amqlibConnection: Connection | null;
  private channel: Channel | null;

  constructor() {
    this.amqlibConnection = null;
    this.channel = null;
  }

  async getChannel(): Promise<Channel> {
    if (this.amqlibConnection === null) {
      this.amqlibConnection = await amqplib.connect(config.MSG_QUEUE_URL);
    }
    if (this.channel === null) {
      this.channel = await this.amqlibConnection.createChannel();
    }
    return this.channel;
  }

  async closeConnectionAndChannel() {
    if (this.channel) {
      await this.channel.close();
      this.channel = null;
    }
    if (this.amqlibConnection) {
      await this.amqlibConnection.close();
      this.amqlibConnection = null;
    }
  }

  async RPC_Observer(userService: MedicineRPCServiceInterface) {
    const channel = await this.getChannel();

    const RPC_QUEUE_NAME = config.SELF_RPC_QUEUE;

    await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });

    await channel.prefetch(1);
    log.info(`Waiting for RPC requests in ${RPC_QUEUE_NAME}`);

    // consume the request
    channel.consume(
      RPC_QUEUE_NAME,
      async (msg: Message | null) => {
        if (msg && msg.content) {
          log.info(`Received RPC request: ${msg.content.toString()}`);

          const payload: RPC_Request_Payload = JSON.parse(
            msg.content.toString()
          ) as RPC_Request_Payload;

          try {
            const response: RPC_Response_Payload =
              await userService.serveRPCRequest(payload);

            log.info(
              `Response to ${payload.type} : ${JSON.stringify(response)}`
            );

            // send the response
            channel.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(response)),
              {
                correlationId: msg.properties.correlationId,
              }
            );

            // acknowledge the message
            channel.ack(msg);
          } catch (error) {
            // Handle the error gracefully
            log.error(
              `Error processing RPC request for ${payload.type}: ${error.message}`
            );

            //send an error response to the sender if needed.

            const errorResponse: RPC_Response_Payload = {
              status: "error",
              data: {
                message: "An error occurred while processing the request.",
              },
            };
            channel.sendToQueue(
              msg.properties.replyTo,
              Buffer.from(JSON.stringify(errorResponse)),
              {
                correlationId: msg.properties.correlationId,
              }
            );

            // Acknowledge the message even if there's an error, so it is removed from the queue.
            channel.ack(msg);
          }
        }
      },
      {
        // noAck: false means that the message will not be deleted from the queue until it is acknowledged
        noAck: false,
      }
    );
  }
}

export default new BrokerService();
