import io from "socket.io-client";

const socket = io("http://localhost:3000", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

let isConnecting = false;
let currentUserId = null;
let currentVecindarioId = null;

export const connectSocket = (userId, vecindarioId) => {
  // Evitar múltiples conexiones
  if (isConnecting) {
    console.log('🔄 Ya se está conectando...');
    return;
  }

  // Si ya está conectado con los mismos datos, no hacer nada
  if (socket.connected && currentUserId === userId && currentVecindarioId === vecindarioId) {
    console.log('✅ Ya conectado con los mismos datos');
    return;
  }

  isConnecting = true;
  currentUserId = userId;
  currentVecindarioId = vecindarioId;

  if (!socket.connected) {
    socket.connect();
    
    // Esperar a que se conecte antes de identificar al usuario
    socket.once('connect', () => {
      console.log('🔌 Socket conectado, identificando usuario...');
      socket.emit("identificarUsuario", { userId, vecindarioId });
      isConnecting = false;
    });
  } else {
    // Si ya está conectado, identificar directamente
    socket.emit("identificarUsuario", { userId, vecindarioId });
    isConnecting = false;
  }
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
    currentUserId = null;
    currentVecindarioId = null;
    isConnecting = false;
  }
};

export const joinVecindario = (vecindarioId) => {
  if (socket.connected) {
    socket.emit("unirseAlVecindario", vecindarioId);
    console.log(`🏘️ Unido al vecindario: ${vecindarioId}`);
  }
};

export const sendNotification = (vecindarioId, mensaje, tipo = 'alerta', emisor = null) => {
  if (socket.connected) {
    socket.emit('enviarNotificacion', {
      sala: vecindarioId,
      mensaje,
      tipo,
      emisor
    });
    console.log(`📢 Notificación enviada al vecindario ${vecindarioId}: ${mensaje}`);
  }
};

export const sendAlarm = (vecindarioId, tipo, descripcion, emisor = null) => {
  if (socket.connected) {
    socket.emit('nuevaAlarma', {
      vecindarioId,
      tipo,
      descripcion,
      emisor
    });
    console.log(`🚨 Alarma enviada al vecindario ${vecindarioId}: ${tipo}`);
  }
};

socket.on("connect", () => {
  console.log("✅ Conectado al servidor WebSocket");
  isConnecting = false;
});

socket.on("connect_error", (error) => {
  console.error("❌ Error de conexión:", error);
  isConnecting = false;
});

socket.on("disconnect", (reason) => {
  console.log("🔌 Desconectado del servidor:", reason);
  isConnecting = false;
});

socket.on("reconnect", (attemptNumber) => {
  console.log("🔄 Reconectado al servidor después de", attemptNumber, "intentos");
  // Re-identificar usuario después de reconexión
  if (currentUserId && currentVecindarioId) {
    socket.emit("identificarUsuario", { userId: currentUserId, vecindarioId: currentVecindarioId });
  }
});

socket.on("reconnect_error", (error) => {
  console.error("❌ Error de reconexión:", error);
});

export default socket;
