import express from "express";
import { handleUserLocation } from "../controllers/ubicacionController.mjs";  // Import the controller

const router = express.Router();
router.post("/", handleUserLocation); 
export default router;
