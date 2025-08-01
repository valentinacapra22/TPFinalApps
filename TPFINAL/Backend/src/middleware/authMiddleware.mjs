// src/middleware/authMiddleware.mjs
import * as authService from '../services/authService.mjs';

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

	if (!token) return res.sendStatus(401); // No hay token

	try {
		const usuarioId = await authService.validateToken(token);
		req.usuarioId = usuarioId; // Almacena el userId en la solicitud para uso posterior
		next(); // Llama al siguiente middleware o controlador
	} catch (error) {
		res.sendStatus(403); // Token no válido
	}
};
