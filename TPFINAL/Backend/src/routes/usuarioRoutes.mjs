// src/routes/usuarioRoutes.mjs
import express from 'express';
import * as usuarioController from '../controllers/usuarioController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

// Rutas públicas (sin autenticación)
router
	.route('/')
	.post(usuarioController.createUsuario);

// Rutas protegidas (con autenticación)
router.use(authenticateToken);

router
	.route('/')
	.get(usuarioController.getAllUsuarios);

// Obtener datos del usuario actual (basado en el token)
router.get('/me', usuarioController.getUsuarioActual);

router
	.route('/:id')
	.get(usuarioController.getUsuarioById)
	.put(usuarioController.updateUsuario)
	.delete(usuarioController.deleteUsuario);

export default router;
