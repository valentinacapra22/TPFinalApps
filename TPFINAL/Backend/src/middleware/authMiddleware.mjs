import * as authService from '../services/authService.mjs';

export const authenticateToken = async (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1]; 
	if (!token) return res.sendStatus(401); 

	try {
		const usuarioId = await authService.validateToken(token);
		req.usuarioId = usuarioId; 
		next(); 
	} catch (error) {
		res.sendStatus(403); 
	}
};
