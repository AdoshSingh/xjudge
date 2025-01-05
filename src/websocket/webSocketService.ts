import http from 'http';
import WebSocket from 'ws';
import { inMemoryStore } from '../utils/inMemoryStore';
import { messagingQueue } from '../services/queue/messaging';

class WebSocketService {
  private server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse> | undefined | null;
  private wss: WebSocket.Server<typeof WebSocket, typeof http.IncomingMessage> | undefined | null;

  public initializeSocketServer(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.server = server;
    this.wss = new WebSocket.Server({server});
    this.wss.on('connection', this.handleSocketConnection.bind(this));
    console.log(`WebSocket server started on port 9000`);
  }

  private handleSocketConnection(ws: WebSocket, req: http.IncomingMessage){
    ws.send('You are connected with the server!');

    const userId = req.headers['user-id'] as string;
    inMemoryStore.userConnections[userId] = ws;

    console.log(`User with id -> ${userId} connected!`);

    this.startConsumeQueue();

    ws.on('message', async (message) => {
      console.log(`Recieved message: `, message);
      ws.send(`You said: ${message}`);
    });
  
    ws.on('close', () => {
      console.log('Client disconnected');
    });
  }

  private startConsumeQueue() {
    messagingQueue.consumeQueue('resultQueue', (message: any) => {
        const openMessage = JSON.parse(message);
        const user = openMessage.user;
        const output = openMessage.output;
        console.log(openMessage);
      if(inMemoryStore.userConnections[user]?.readyState === WebSocket.OPEN) {
        inMemoryStore.userConnections[user].send(output);
      }
    });
  }

  private static instance: WebSocketService;

  private constructor(
    
  ) {
    this.server = null;
    this.wss = null;
  }

  public static getInstance() {
    if(!WebSocketService.instance){
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }
}

export const webSocketService = WebSocketService.getInstance();