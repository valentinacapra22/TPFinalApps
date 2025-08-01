import express from 'express';
import * as notificacionController from '../controllers/notificacionController.mjs';

const router = express.Router();

router
    .route('/')
    .get(notificacionController.getAllNotificaciones)   
    .post(notificacionController.createNotificacion);   

router
    .route('/:id')
    .get(notificacionController.getNotificacionById)    
    .put(notificacionController.updateNotificacion)     
    .delete(notificacionController.deleteNotificacion); 
export default router;
