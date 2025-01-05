import express from 'express';
import questionRouter from './routes/question';
import http from 'http';
import { startQueueService } from './services/queue';
import { startWebSocketServer } from './websocket';

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use('/question', questionRouter);

startQueueService();
startWebSocketServer(server);

server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught Exception at ${origin}: ${err}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});