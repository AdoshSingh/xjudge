import amqp from 'amqplib/callback_api';

export class MessagingQueue {
  private RABBITQ_URL =  process.env.RABBITQ_URL || 'amqp://localhost';

  public async pushToQueue(queue: string, message: any) {
    amqp.connect(this.RABBITQ_URL, (err, connection) => {
      if(err) {
        console.log(err);
        throw new Error('Failed to connect to RabbitMQ');
      }

      connection.createChannel((err, channel) => {
        if (err) {
          throw new Error('Failed to create channel');
        }

        const queueToPushTheMessageIn = queue;
        const messageToPush = JSON.stringify(message);

        channel.assertQueue(queueToPushTheMessageIn, {durable: true});
        channel.sendToQueue(queueToPushTheMessageIn, Buffer.from(messageToPush), {persistent: true});
      });
    });
  }

  public async consumeQueue(queue: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      amqp.connect(this.RABBITQ_URL, (err, connection) => {
        if (err) {
          console.log(err);
          reject(new Error('Failed to connect to RabbitMQ'));
          return;
        }
  
        connection.createChannel((err, channel) => {
          if (err) {
            reject(new Error('Failed to create channel'));
            return;
          }
  
          const queueToConsume = queue;
          channel.assertQueue(queueToConsume, { durable: true });
  
          channel.consume(queueToConsume, (msg) => {
            if (msg) {
              const result = msg.content.toString();
              channel.ack(msg);
              resolve(result);
            } else {
              reject(new Error('No message received'));
            }
          });
        });
      });
    });
  }
}