import http from 'http';
import { webSocketService } from './webSocketService';

export const startWebSocketServer = (
  server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>,
) => {
  webSocketService.initializeSocketServer(server);
};