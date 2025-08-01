// src/config/socketConfig.mjs
import socketIo from 'socket.io';

export const configureSocket = (server) => {
  const io = socketIo(server);

  io.on('connection', (socket) => {
    console.log('Usuario conectado');
    // Aquí manejas eventos
  });

  return io;
};
