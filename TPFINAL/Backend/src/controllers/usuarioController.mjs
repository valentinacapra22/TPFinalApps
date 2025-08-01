import * as usuarioService from '../services/usuarioService.mjs';
import catchAsync from '../helpers/catchAsync.mjs';

export const getAllUsuarios = catchAsync(async (req, res) => {
  const usuarios = await usuarioService.getAllUsuarios();
  res.status(200).json(usuarios);
});

export const getUsuarioById = catchAsync(async (req, res) => {
  const usuario = await usuarioService.getUsuarioById(req.params.id);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.status(200).json(usuario);
});

export const getUsuarioActual = catchAsync(async (req, res) => {
  const usuario = await usuarioService.getUsuarioById(req.usuarioId);
  if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
  res.status(200).json(usuario);
});

export const createUsuario = catchAsync(async (req, res) => {
  const usuario = await usuarioService.createUsuario(req.body);
  res.status(201).json(usuario);
});

export const updateUsuario = catchAsync(async (req, res) => {
  const usuario = await usuarioService.updateUsuario(req.params.id, req.body);
  res.status(200).json(usuario);
});

export const deleteUsuario = catchAsync(async (req, res) => {
  if (!await usuarioService.getUsuarioById(req.params.id)) return res.status(404).json({ message: 'Usuario no encontrado' });
  await usuarioService.deleteUsuario(req.params.id);
  res.status(204).json({ message: 'Usuario eliminado' });
});