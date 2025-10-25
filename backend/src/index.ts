import express from 'express';
import questionRouter from './routes/question';
import http from 'http';
import { startQueueService } from './services/queue';
import { startWebSocketServer } from './websocket';
import { appConfig } from './config/appConfig';
import { connectToDatabase } from './db';
import path from 'path';

const PORT = appConfig.port;

const app = express();
const server = http.createServer(app);

app.use(express.json());

app.use('/api/question', questionRouter);

const startServer = async () => {
  try {
    await connectToDatabase(appConfig.dbUrl);
    await startQueueService();
    startWebSocketServer(server);
    server.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

app.use(express.static(path.resolve(__dirname, '../' + '/public/' + '/dist')));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '../' + '/public/' + '/dist', "index.html"));
});

startServer();

process.on('uncaughtException', (err, origin) => {
  console.error(`Uncaught Exception at ${origin}: ${err}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});