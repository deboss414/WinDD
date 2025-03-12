import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

export const setupWebSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('join-project', (projectId) => {
      socket.join(`project-${projectId}`);
    });

    socket.on('task-update', (data) => {
      io.to(`project-${data.projectId}`).emit('task-updated', data);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

  return io;
}; 