import express from 'express';
import questionRouter from './routes/question';
import http from 'http';
import WebSocket from 'ws';
import { MessagingQueue } from './services/messaging';

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
const msgQ = new MessagingQueue(); 

// const userConnections: Record<string, any> = {};

wss.on('connection', (ws, req) => {
  console.log('New client connected');
  ws.send('Welcome to the socket server');

  // const userId = req.headers['user-id'] as string;
  // userConnections[userId] = ws;

  ws.on('message', async (message) => {
    try {
      const result = await msgQ.consumeQueue('resultQueue');
      if(result) ws.send(result);
    } catch (error) {
      console.log('Error while consuming message:', error);
      ws.send('Error processing your request');
    }
  
    // console.log(`Recieved message: `, message);
    ws.send(`You said: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.use(express.json());
app.use('/question', questionRouter);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});