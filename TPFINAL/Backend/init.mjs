import http from 'http';
import app from './src/app.mjs';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:8081", "http://localhost:3001"],
    credentials: true
  }
});

// Mapa para almacenar usuarios conectados por vecindario
const usuariosPorVecindario = new Map();
const connectedClients = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Usuario conectado: ${socket.id}`);

  // Agregar usuario al Map
  connectedClients.set(socket.id, { id: socket.id });

  // Evento para identificar usuario y unirlo a su vecindario
  socket.on('identificarUsuario', ({ userId, vecindarioId }) => {
    console.log(`👤 Usuario ${userId} identificado, uniéndose al vecindario ${vecindarioId}`);
    
    // Guardar información del usuario en el socket
    socket.userId = userId;
    socket.vecindarioId = vecindarioId;
    
    // Unir al usuario a la sala del vecindario
    socket.join(`vecindario_${vecindarioId}`);
    
    // Agregar usuario al mapa de vecindarios
    if (!usuariosPorVecindario.has(vecindarioId)) {
      usuariosPorVecindario.set(vecindarioId, new Set());
    }
    usuariosPorVecindario.get(vecindarioId).add(userId);
    
    console.log(`✅ Usuario ${userId} unido al vecindario ${vecindarioId}`);
    console.log(`📊 Usuarios en vecindario ${vecindarioId}:`, Array.from(usuariosPorVecindario.get(vecindarioId)));
  });

  // Evento para unirse a un vecindario (mantener compatibilidad)
  socket.on('unirseAlVecindario', (vecindarioId) => {
    console.log(`📩 Usuario se une al vecindario: ${vecindarioId}`);
    socket.join(`vecindario_${vecindarioId}`);
  });

  // Evento para enviar notificación a un vecindario
  socket.on('enviarNotificacion', ({ sala, mensaje, tipo, emisor }) => {
    console.log(`📢 Enviando notificación a la sala ${sala}: ${mensaje}`);
    
    const notificacion = {
      mensaje,
      tipo: tipo || 'info',
      emisor: emisor || 'Usuario',
      timestamp: new Date().toISOString(),
      vecindarioId: sala
    };
    
    // Enviar notificación al vecindario
    io.to(`vecindario_${sala}`).emit('notificacion', notificacion);
  });

  // Evento para nueva alarma
  socket.on("nuevaAlarma", (data) => {
    console.log(`🚨 Nueva alarma recibida:`, data);
    const { vecindarioId, tipo, descripcion, emisor } = data;
    
    const notificacion = {
      mensaje: descripcion || `Alarma de ${tipo} activada`,
      tipo: 'alarma',
      emisor: emisor || 'Usuario',
      timestamp: new Date().toISOString(),
      vecindarioId
    };
    
    // Enviar notificación de alarma al vecindario
    io.to(`vecindario_${vecindarioId}`).emit('nuevaAlarma', notificacion);
  });

  // Manejo de desconexión
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
    
    // Remover usuario de los mapas
    connectedClients.delete(socket.id);
    
    if (socket.userId && socket.vecindarioId) {
      const vecindario = usuariosPorVecindario.get(socket.vecindarioId);
      if (vecindario) {
        vecindario.delete(socket.userId);
        if (vecindario.size === 0) {
          usuariosPorVecindario.delete(socket.vecindarioId);
        }
      }
      console.log(`👤 Usuario ${socket.userId} removido del vecindario ${socket.vecindarioId}`);
    }

    // Notificar a los clientes sobre la actualización
    io.emit('update-clients', Array.from(connectedClients.values()));
  });

  // Evento para solicitar la lista de clientes conectados
  socket.on('get-clients', () => {
    socket.emit('update-clients', Array.from(connectedClients.values()));
  });

  // Evento para obtener usuarios de un vecindario
  socket.on('get-vecindario-users', (vecindarioId) => {
    const usuarios = usuariosPorVecindario.get(vecindarioId) || new Set();
    socket.emit('vecindario-users', Array.from(usuarios));
  });
});

const port = process.env.PORT || 3000;

// Inicializar servidor
const startServer = async () => {
  try {
    // Iniciar servidor HTTP
    server.listen(port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${port}`);
      console.log(`🔌 Socket.IO configurado y listo`);
      console.log(`📝 Historial de notificaciones persistente disponible`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

startServer();

// Exportar io para uso en otros módulos
export { io };
