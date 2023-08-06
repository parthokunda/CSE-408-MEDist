## Patient Service RPC call from Auth Service
#### GET_ID
```typescript
const payload: RPC_Request_Payload = {
      type: "GET_ID",
      data: {
        userID: existingUser.id,
      },
    };
```
> get patient id from patient service if patient exists ( signed up already )


#### CREATE_NEW_ENTITY 
```typescript
  const payload: RPC_Request_Payload = {
      type: "CREATE_NEW_ENTITY",
      data: {
        userID: newUser.id,
      },
    };
```
> create new patient entity in patient service if patient does not exist ( sign up first time )

## Auth Service RPC call
- `AUTHORIZATION` : check if the user is authorized to access the resource


## message broker installation
```bash
npm i jsonwebtoken bcrypt
npm i -D @types/jsonwebtoken @types/bcrypt

npm i amqplib
npm i -D @types/amqplib

```

## message broker configuration for future use
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