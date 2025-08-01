import * as historialService from "../services/historialNotificacionesService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

// Obtener historial de notificaciones de un vecindario
export const obtenerHistorial = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { limit = 50, offset = 0 } = req.query;

  const historial = await historialService.obtenerHistorial(
    vecindarioId,
    parseInt(limit),
    parseInt(offset)
  );

  res.status(200).json({
    success: true,
    data: historial,
  });
});

// Obtener historial filtrado por tipo
export const obtenerHistorialPorTipo = catchAsync(async (req, res) => {
  const { vecindarioId, tipo } = req.params;
  const { limit = 50 } = req.query;

  const historial = await historialService.obtenerHistorialPorTipo(
    vecindarioId,
    tipo,
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    data: historial,
  });
});

// Buscar notificaciones por texto
export const buscarNotificaciones = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { q: query, limit = 20 } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Término de búsqueda requerido" });
  }

  const resultados = await historialService.buscarNotificaciones(
    vecindarioId,
    query,
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    data: resultados,
  });
});

// Obtener notificaciones recientes
export const obtenerNotificacionesRecientes = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const { limit = 10 } = req.query;

  const notificaciones = await historialService.obtenerNotificacionesRecientes(
    vecindarioId,
    parseInt(limit)
  );

  res.status(200).json({
    success: true,
    data: notificaciones,
  });
});

// Limpiar historial de un vecindario
export const limpiarHistorial = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  const resultado = await historialService.limpiarHistorial(vecindarioId);
  res.status(200).json({
    success: true,
    message: resultado.mensaje,
  });
});

// Agregar notificaciones de prueba
export const agregarNotificacionesPrueba = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  await historialService.agregarNotificacionesPrueba(vecindarioId);
  res.status(200).json({
    success: true,
    message: "Notificaciones de prueba agregadas exitosamente",
  });
});