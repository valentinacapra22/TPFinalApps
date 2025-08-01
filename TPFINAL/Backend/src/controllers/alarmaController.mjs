import * as alarmaService from "../services/alarmaService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

export const activarAlarma = catchAsync(async (req, res) => {
  const usuarioId = req.usuarioId;
  const { descripcion, tipo } = req.body;

  if (!descripcion || !tipo) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  try {
    // Usar el servicio createAlarma que ya maneja las notificaciones
    const alarma = await alarmaService.createAlarma({
      tipo,
      descripcion,
      usuarioId,
      activo: true
    });

    res.status(200).json({ 
      message: "Alarma activada exitosamente", 
      alarma,
      notificacionEnviada: true 
    });
  } catch (error) {
    console.error("Error al activar alarma:", error);
    res.status(500).json({ error: "Error al activar la alarma" });
  }
});

export const getAllAlarmas = catchAsync(async (req, res) => {
  const alarmas = await alarmaService.getAllAlarmas();
  res.status(200).json(alarmas);
});

export const getAlarmaById = catchAsync(async (req, res) => {
  const alarma = await alarmaService.getAlarmaById(req.params.id);
  if (!alarma) return res.status(404).json({ message: "Alarma no encontrada" });
  res.status(200).json(alarma);
});

export const createAlarma = catchAsync(async (req, res) => {
  const alarma = await alarmaService.createAlarma(req.body);
  res.status(201).json(alarma);
});

export const updateAlarma = catchAsync(async (req, res) => {
  const alarma = await alarmaService.updateAlarma(req.params.id, req.body);
  res.status(200).json(alarma);
});

export const deleteAlarma = catchAsync(async (req, res) => {
  const alarmaExistente = await alarmaService.getAlarmaById(req.params.id);
  if (!alarmaExistente) return res.status(404).json({ message: "Alarma no encontrada" });

  await alarmaService.deleteAlarma(req.params.id);
  res.status(204).json({ message: "Alarma eliminada" });
});

export const getEstadisticasVecindario = catchAsync(async (req, res) => {
  const { vecindarioId } = req.params;
  
  if (!vecindarioId) {
    return res.status(400).json({ error: "ID de vecindario requerido" });
  }

  try {
    const estadisticas = await alarmaService.getEstadisticasPorVecindario(vecindarioId);
    res.status(200).json(estadisticas);
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas" });
  }
});
