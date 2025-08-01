import axios from 'axios';

const BASE_URL = "http://localhost:3000/api";

// Configurar axios con interceptor para el token
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("userToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Request config:', config);
  return config;
});

// Interceptor para respuestas
api.interceptors.response.use(
  (response) => {
    console.log('Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Obtener historial de notificaciones de un vecindario
export const obtenerHistorial = async (vecindarioId, limit = 50, offset = 0) => {
  try {
    console.log('Llamando a obtenerHistorial con vecindarioId:', vecindarioId);
    const response = await api.get(`/historial/vecindario/${vecindarioId}`, {
      params: { limit, offset }
    });
    console.log('Respuesta de obtenerHistorial:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo historial:', error);
    throw error;
  }
};

// Obtener historial filtrado por tipo
export const obtenerHistorialPorTipo = async (vecindarioId, tipo, limit = 50) => {
  try {
    const response = await api.get(`/historial/vecindario/${vecindarioId}/tipo/${tipo}`, {
      params: { limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo historial por tipo:', error);
    throw error;
  }
};

// Obtener estadísticas del historial
export const obtenerEstadisticas = async (vecindarioId) => {
  try {
    const response = await api.get(`/historial/vecindario/${vecindarioId}/estadisticas`);
    return response.data;
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    throw error;
  }
};

// Buscar notificaciones por texto
export const buscarNotificaciones = async (vecindarioId, query, limit = 20) => {
  try {
    const response = await api.get(`/historial/vecindario/${vecindarioId}/buscar`, {
      params: { q: query, limit }
    });
    return response.data;
  } catch (error) {
    console.error('Error buscando notificaciones:', error);
    throw error;
  }
};

// Obtener notificaciones recientes
export const obtenerNotificacionesRecientes = async (vecindarioId, horas = 24) => {
  try {
    const response = await api.get(`/historial/vecindario/${vecindarioId}/recientes`, {
      params: { horas }
    });
    return response.data;
  } catch (error) {
    console.error('Error obteniendo notificaciones recientes:', error);
    throw error;
  }
};

// Limpiar historial de un vecindario
export const limpiarHistorial = async (vecindarioId) => {
  try {
    const response = await api.delete(`/historial/vecindario/${vecindarioId}`);
    return response.data;
  } catch (error) {
    console.error('Error limpiando historial:', error);
    throw error;
  }
};

// Función helper para formatear fecha
export const formatearFecha = (timestamp) => {
  const fecha = new Date(timestamp);
  const ahora = new Date();
  const diffMs = ahora - fecha;
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  if (diffHoras < 24) return `Hace ${diffHoras}h`;
  if (diffDias < 7) return `Hace ${diffDias} días`;
  
  return fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función helper para obtener icono según tipo
export const obtenerIcono = (tipo) => {
  switch (tipo) {
    case 'alarma':
      return '🚨';
    case 'success':
      return '✅';
    case 'warning':
      return '⚠️';
    case 'info':
      return '📢';
    default:
      return '📋';
  }
};

// Función helper para obtener color según tipo
export const obtenerColor = (tipo) => {
  switch (tipo) {
    case 'alarma':
      return '#dc3545';
    case 'success':
      return '#28a745';
    case 'warning':
      return '#ffc107';
    case 'info':
      return '#007bff';
    default:
      return '#6c757d';
  }
}; 