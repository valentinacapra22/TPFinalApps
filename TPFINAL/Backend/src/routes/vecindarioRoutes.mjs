// src/routes/vecindarioRoutes.mjs
import express from 'express';
import * as vecindarioController from '../controllers/vecindarioController.mjs';

const router = express.Router();

router
	.route('/')
	.get(vecindarioController.getAllVecindarios)
	.post(vecindarioController.createVecindario);

router
	.route('/:id')
	.get(vecindarioController.getVecindarioById)
	.put(vecindarioController.updateVecindario)
	.delete(vecindarioController.deleteVecindario);

export default router;
