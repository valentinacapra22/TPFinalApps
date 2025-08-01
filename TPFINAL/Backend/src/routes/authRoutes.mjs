import express from 'express';
import { login, validateToken } from '../controllers/authController.mjs';
import { authenticateToken } from '../middleware/authMiddleware.mjs';

const router = express.Router();

router.post('/login', login);
router.post('/validate-token', validateToken);

router.get('/protected-route', authenticateToken, (req, res) => {
	res.status(200).json({ message: 'Acceso concedido', userId: req.userId });
});

export default router;
