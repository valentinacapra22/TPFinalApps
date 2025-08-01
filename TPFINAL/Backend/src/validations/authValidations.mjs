// src/validations/authValidations.mjs
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email({ message: 'Formato de email inválido' }),
	contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});
