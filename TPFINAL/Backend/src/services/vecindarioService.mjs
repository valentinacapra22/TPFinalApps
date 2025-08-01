// src/services/vecindarioService.mjs
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllVecindarios = async () => {
	return await prisma.vecindario.findMany();
};

export const getVecindarioById = async (id) => {
	return await prisma.vecindario.findUnique({
		where: { vecindarioId: parseInt(id) },
	});
};

export const createVecindario = async (data) => {
	const { nombre, ciudad, ubicacion } = data;

	// Validación de datos
	if (!nombre || !ciudad || !ubicacion) {
		throw new Error('Todos los campos (nombre, ciudad, ubicacion) son obligatorios');
	}

	// Crear el vecindario
	return await prisma.vecindario.create({
		data: {
			nombre,
			ciudad,
			ubicacion,
		},
	});
};

export const updateVecindario = async (id, data) => {


	return await prisma.vecindario.update({
		where: { vecindarioId: parseInt(id) },
		data,
	});
};

export const deleteVecindario = async (id) => {
	return await prisma.vecindario.delete({
		where: { vecindarioId: parseInt(id) }
	});
};

