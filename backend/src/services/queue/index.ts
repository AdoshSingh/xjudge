import { messagingQueue } from './messaging'

export const startQueueService = async () => {
  try {
    await messagingQueue.initialize();
    console.log('RabbitMQ initialized');
  } catch (err) {
    console.error('Failed to initialize RabbitMQ', err);
  }
};