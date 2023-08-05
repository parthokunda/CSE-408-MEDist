// external imports
import amqplib, { Connection, Channel, Message } from "amqplib";
import { v4 as uuidv4 } from "uuid";

// internal imports
import { config } from "../config";
import log from "./logger";
import { UserServiceInterface } from "services/user.service";

export interface RPC_Request_Payload {
  type: string;
  data: object;
}

export interface BrokerServiceInterface {
  createChannel(): Promise<Channel>;

  publishMessage(
    channel: Channel,
    toService: string,
    message: string
  ): Promise<void>;

  subscribeMessage(channel: Channel, toService: string): Promise<void>;

  RPC_Request(
    RPC_QUEUE_NAME: string,
    requestPayload: RPC_Request_Payload
  ): Promise<any>;

  RPC_Observer(
    RPC_QUEUE_NAME: string,
    userService: UserServiceInterface
  ): Promise<void>;
}

class BrokerService implements BrokerServiceInterface {
  private amqlibConnection: Connection;

  constructor() {
    this.amqlibConnection = null;
  }

  async getChannel(): Promise<Channel> {
    if (this.amqlibConnection === null) {
      this.amqlibConnection = await amqplib.connect(config.MSG_QUEUE_URL);
    }
    return await this.amqlibConnection.createChannel();
  }

  async createChannel(): Promise<Channel> {
    const channel: Channel = await this.getChannel();
    await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
      durable: true,
    });
    return channel;
  }

  // to notify other services that some event has occured
  async publishMessage(
    channel: Channel,
    toService: string,
    message: string
  ): Promise<void> {
    await channel.publish(
      config.EXCHANGE_NAME,
      toService,
      Buffer.from(message)
    );

    log.info(`Message sent to ${toService} : ${message}`);
  }

  async subscribeMessage(channel: Channel, fromService: string): Promise<void> {
    await channel.assertExchange(config.EXCHANGE_NAME, "direct", {
      durable: true,
    });

    const q = await channel.assertQueue("", { exclusive: true });
    log.info(`Waiting for messages in ${q.queue}`);

    channel.bindQueue(q.queue, config.EXCHANGE_NAME, config.AUTH_SERVICE);

    channel.consume(q.queue, (msg: Message | null) => {
      if (msg.content) {
        log.info(
          `Received message from ${fromService} : ${msg.content.toString()}`
        );
      }
    });
  }

  async RPC_Request(
    RPC_QUEUE_NAME: string,
    requestPayload: RPC_Request_Payload
  ) {
    const uuid = uuidv4(); // correlation id

    const channel = await this.getChannel();
    const queue = await channel.assertQueue("", { exclusive: true });

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
        resolve("API could not fulfill the request");
      }, 8000);

      // consume the response
      channel.consume(
        queue.queue,

        (msg: Message | null) => {
          if (msg.properties.correlationId === uuid) {
            // if correlation id matches, that means the response is for the request we sent
            resolve(JSON.parse(msg.content.toString()));
            clearTimeout(timeout);
          } else {
            // means the response is not for the request we sent
            reject("Correlation ID mismatch. Data not found!");
          }
        },
        {
          // noAck: true means that the message will be deleted from the queue as soon as it is consumed
          noAck: true,
        }
      );
    });
  }

  async RPC_Observer(
    RPC_QUEUE_NAME: string,
    userService: UserServiceInterface
  ) {
    const channel = await this.getChannel();

    await channel.assertQueue(RPC_QUEUE_NAME, { durable: false });

    await channel.prefetch(1);
    log.info(`Waiting for RPC requests in ${RPC_QUEUE_NAME}`);

    // consume the request
    channel.consume(
      RPC_QUEUE_NAME,
      async (msg: Message | null) => {
        if (msg.content) {
          const payload: RPC_Request_Payload = JSON.parse(
            msg.content.toString()
          ) as RPC_Request_Payload;

          const response = await userService.serveRPCRequest(payload);
          log.info(`Response to ${payload.type} : ${response}`);

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
