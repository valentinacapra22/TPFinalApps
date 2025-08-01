import * as notificacionService from '../services/notificacionService.mjs';
import catchAsync from '../helpers/catchAsync.mjs';

export const getAllNotificaciones = catchAsync(async (req, res) => {
	const notificaciones = await notificacionService.getAllNotificaciones();
	res.status(200).json(notificaciones);
});

export const getNotificacionById = catchAsync(async (req, res) => {
	const notificacion = await notificacionService.getNotificacionById(req.params.id);
	if (!notificacion) return res.status(404).json({ message: 'Notificación no encontrada' });
	res.status(200).json(notificacion);
});

export const createNotificacion = catchAsync(async (req, res) => {
	const notificacion = await notificacionService.createNotificacion(req.body);
	res.status(201).json(notificacion);
});

export const updateNotificacion = catchAsync(async (req, res) => {
	const notificacion = await notificacionService.updateNotificacion(req.params.id, req.body);
	res.status(200).json(notificacion);
});

export const deleteNotificacion = catchAsync(async (req, res) => {
	const notificacionExistente = await notificacionService.getNotificacionById(req.params.id);
	if (!notificacionExistente) return res.status(404).json({ message: 'Notificación no encontrada' });

	await notificacionService.deleteNotificacion(req.params.id);
	res.status(204).json({ message: 'Notificación eliminada' });
});
