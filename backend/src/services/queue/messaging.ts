import amqp from 'amqplib/callback_api';
import { appConfig } from '../../config/appConfig';

class MessagingQueue {
  private rabbitmqUrl =  appConfig.rabbitmqUrl;
  private connection: amqp.Connection | undefined | null;
  private channel:amqp.Channel | undefined | null;

  public async initialize(){
    return new Promise((resolve, reject) => {
      amqp.connect(this.rabbitmqUrl, (err, conn) => {
        if(err) {
          console.error('Failed to connect to RabbitMQ:', err);
          return reject(err);
        }
        this.connection = conn;
        conn.createChannel((err, chanl) => {
          if(err) {
            console.error('Failed to create RabbitMQ channel:', err);
            return reject(err);
          }
          this.channel = chanl;
          resolve(null);
        })
      })
    })
  }
  
  public async pushToQueue(queue: string, message: any) {
    if(!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    const queueToPushTheMessageIn = queue;
    const messageToPush = JSON.stringify(message);

    this.channel.assertQueue(queueToPushTheMessageIn, {durable: true});
    this.channel.sendToQueue(queueToPushTheMessageIn, Buffer.from(messageToPush), {persistent: true});
  }
  
  public async consumeQueue(queue: string, callback: any) {
    if(!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }

    const queueToConsume = queue;
    this.channel.assertQueue(queueToConsume, {durable: true});

    this.channel.consume(queueToConsume, (msg) => {
      if(msg) {
        const content = msg.content.toString();
        callback(content);
        this.channel?.ack(msg)
      }
    })
  }

  private static instance: MessagingQueue;
  
  private constructor() {
    this.rabbitmqUrl = appConfig.rabbitmqUrl;
    this.connection = null;
    this.channel = null;
  }

  public static getInstance() {
    if(!MessagingQueue.instance) {
      MessagingQueue.instance = new MessagingQueue();
    }
    return MessagingQueue.instance;
  }
}

export const messagingQueue = MessagingQueue.getInstance();