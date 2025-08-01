// src/validations/userValidations.mjs
import { z } from 'zod';

export const registerSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio' }),
	apellido: z.string().min(1, { message: 'El apellido es obligatorio' }),
	email: z.string().email({ message: 'Formato de email inválido' }),
	contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
	direccion: z.string().min(1, { message: 'La dirección es obligatoria' }),
	telefono: z.string().regex(/^\d{10,15}$/, { message: 'El teléfono debe tener entre 10 y 15 dígitos' }),
	vecindarioId: z.number().int().positive({ message: 'vecindarioId debe ser un número positivo' }),
	calle1: z.string().optional(),
	calle2: z.string().optional(),
	piso: z.string().optional(),
	depto: z.string().optional()
});

// Schema para actualización (sin contraseña obligatoria)
export const updateUserSchema = z.object({
	nombre: z.string().min(1, { message: 'El nombre es obligatorio' }).optional(),
	apellido: z.string().min(1, { message: 'El apellido es obligatorio' }).optional(),
	email: z.string().email({ message: 'Formato de email inválido' }).optional(),
	contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }).optional(),
	direccion: z.string().min(1, { message: 'La dirección es obligatoria' }).optional(),
	telefono: z.string().regex(/^\d{10,15}$/, { message: 'El teléfono debe tener entre 10 y 15 dígitos' }).optional(),
	vecindarioId: z.number().int().positive({ message: 'vecindarioId debe ser un número positivo' }).optional(),
	calle1: z.string().optional(),
	calle2: z.string().optional(),
	piso: z.string().optional(),
	depto: z.string().optional()
});
