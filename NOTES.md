```bash
npm i jsonwebtoken bcrypt
npm i -D @types/jsonwebtoken @types/bcrypt

npm i amqplib
npm i -D @types/amqplib

```


```typescript
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


```