import express from "express";
import { handleUserLocation } from "../controllers/ubicacionController.mjs";  // Import the controller

const router = express.Router();

// Define the POST route for saving user location
router.post("/", handleUserLocation);  // POST request to handle location

export default router;
