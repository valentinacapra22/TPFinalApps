// src/controllers/vecindarioController.mjs
import * as vecindarioService from '../services/vecindarioService.mjs';
import catchAsync from '../helpers/catchAsync.mjs';

export const getAllVecindarios = catchAsync(async (req, res) => {

	const vecindarios = await vecindarioService.getAllVecindarios();
	res.status(200).json(vecindarios);
});

export const getVecindarioById = catchAsync(async (req, res) => {
	const vecindario = await vecindarioService.getVecindarioById(req.params.id);
	if (!vecindario) return res.status(404).json({ message: 'Vecindario no encontrado' });
	res.status(200).json(vecindario);
});

export const createVecindario = catchAsync(async (req, res) => {
	const vecindario = await vecindarioService.createVecindario(req.body);
	res.status(201).json(vecindario);
});

export const updateVecindario = catchAsync(async (req, res) => {
	const vecindario = await vecindarioService.updateVecindario(req.params.id, req.body);
	res.status(200).json(vecindario);
});

export const deleteVecindario = catchAsync(async (req, res) => {
	if (!await vecindarioService.getVecindarioById(req.params.id)) return res.status(404).json({ message: 'Vecindario no encontrado' });
	await vecindarioService.deleteVecindario(req.params.id);
	res.status(204).json({ message: 'Vecindario eliminado' });
});
