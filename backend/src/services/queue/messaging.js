"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagingQueue = void 0;
const callback_api_1 = __importDefault(require("amqplib/callback_api"));
const appConfig_1 = require("../../config/appConfig");
class MessagingQueue {
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                callback_api_1.default.connect(this.rabbitmqUrl, (err, conn) => {
                    if (err) {
                        console.error('Failed to connect to RabbitMQ:', err);
                        return reject(err);
                    }
                    this.connection = conn;
                    conn.createChannel((err, chanl) => {
                        if (err) {
                            console.error('Failed to create RabbitMQ channel:', err);
                            return reject(err);
                        }
                        this.channel = chanl;
                        resolve(null);
                    });
                });
            });
        });
    }
    pushToQueue(queue, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error('RabbitMQ channel is not initialized');
            }
            const queueToPushTheMessageIn = queue;
            const messageToPush = JSON.stringify(message);
            this.channel.assertQueue(queueToPushTheMessageIn, { durable: true });
            this.channel.sendToQueue(queueToPushTheMessageIn, Buffer.from(messageToPush), { persistent: true });
        });
    }
    consumeQueue(queue, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.channel) {
                throw new Error('RabbitMQ channel is not initialized');
            }
            const queueToConsume = queue;
            this.channel.assertQueue(queueToConsume, { durable: true });
            this.channel.consume(queueToConsume, (msg) => {
                var _a;
                if (msg) {
                    const content = msg.content.toString();
                    callback(content);
                    (_a = this.channel) === null || _a === void 0 ? void 0 : _a.ack(msg);
                }
            });
        });
    }
    constructor() {
        this.rabbitmqUrl = appConfig_1.appConfig.rabbitmqUrl;
        this.rabbitmqUrl = appConfig_1.appConfig.rabbitmqUrl;
        this.connection = null;
        this.channel = null;
    }
    static getInstance() {
        if (!MessagingQueue.instance) {
            MessagingQueue.instance = new MessagingQueue();
        }
        return MessagingQueue.instance;
    }
}
exports.messagingQueue = MessagingQueue.getInstance();
