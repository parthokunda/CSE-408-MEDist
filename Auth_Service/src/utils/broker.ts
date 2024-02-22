// external imports
import amqplib, { Connection, Channel, Message } from "amqplib";
import { v4 as uuidv4 } from "uuid";

// internal imports
import { config } from "../config";
import log from "./logger";
import { UserServiceInterface } from "../services/user.service";

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
  RPC_Request(
    RPC_QUEUE_NAME: string,
    requestPayload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload>;

  RPC_Observer(userService: UserServiceInterface): Promise<void>;

  PUBLISH_TO_EXCHANGE(
    RPC_EXCHANGE_NAME: string,
    requestPayload: RPC_Request_Payload
  ): Promise<void>;

  SUBSCRIBE_TO_EXCHANGE(
    RPC_EXCHANGE_NAME: string,
    callback: (requestPayload: RPC_Request_Payload) => void
  ): Promise<void>;
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

  //create exchange one time even if the class is instantiated multiple times

  async SUBSCRIBE_TO_EXCHANGE(
    RPC_EXCHANGE_NAME: string,
    callback: (requestPayload: RPC_Request_Payload) => void
  ): Promise<void> {
    const channel = await this.getChannel();

    // Ensure the exchange is declared before binding the queue
    await channel.assertExchange(RPC_EXCHANGE_NAME, "fanout", {
      durable: false,
    });

    const queue = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(queue.queue, RPC_EXCHANGE_NAME, "");

    log.info(`Subscribed to exchange ${RPC_EXCHANGE_NAME}`);

    channel.consume(
      queue.queue,
      (msg: Message | null) => {
        if (msg && msg.content) {
          const requestPayload: RPC_Request_Payload = JSON.parse(
            msg.content.toString()
          ) as RPC_Request_Payload;

          callback(requestPayload);
        }
      },
      {
        noAck: true,
      }
    );
  }

  async PUBLISH_TO_EXCHANGE(
    RPC_EXCHANGE_NAME: string,
    requestPayload: RPC_Request_Payload
  ): Promise<void> {
    const channel = await this.getChannel();

    await channel.assertExchange(RPC_EXCHANGE_NAME, "fanout", {
      durable: false,
    });

    await channel.publish(
      RPC_EXCHANGE_NAME,
      "",
      Buffer.from(JSON.stringify(requestPayload))
    );

    log.info(
      `Published to exchange ${RPC_EXCHANGE_NAME}: ${JSON.stringify(
        requestPayload
      )}`
    );
  }

  async RPC_Request(
    RPC_QUEUE_NAME: string,
    requestPayload: RPC_Request_Payload
  ): Promise<RPC_Response_Payload> {
    const uuid = uuidv4(); // correlation id

    const channel = await this.getChannel();

    // create a temporary queue which will be deleted once the message is consumed
    const queue = await channel.assertQueue("", {
      exclusive: false,
      durable: false,
      autoDelete: true,
    });
    //exclusive: true means that the queue will be deleted once the connection is closed

    log.info(
      `Sending RPC request: ${JSON.stringify(
        requestPayload
      )} to ${RPC_QUEUE_NAME}`
    );

    // send the request
    await channel.sendToQueue(
      RPC_QUEUE_NAME,
      Buffer.from(JSON.stringify(requestPayload)),
      {
        replyTo: queue.queue,
        correlationId: uuid,
      }
    );

    return new Promise((resolve, reject) => {
      // timeout for 8 seconds
      const timeout = setTimeout(() => {
        channel.close();
        reject(new Error("API could not fulfill the request"));
      }, 16000);

      // consume the response
      channel.consume(
        queue.queue,

        (msg: Message | null) => {
          log.info(msg?.content.toString(), "Response in RPC");

          if (msg && msg.properties.correlationId === uuid) {
            //delete the queue
            channel.deleteQueue(queue.queue);
            // if correlation id matches, that means the response is for the request we sent
            resolve(JSON.parse(msg.content.toString()) as RPC_Response_Payload);
            clearTimeout(timeout);
          } else {
            // means the response is not for the request we sent
            reject(new Error("Correlation ID mismatch. Data not found!"));
          }
        },
        {
          // noAck: true means that the message will be deleted from the queue as soon as it is consumed
          noAck: true,
        }
      );
    });
  }

  async RPC_Observer(userService: UserServiceInterface) {
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
          } finally {
            //
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
