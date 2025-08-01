import { saveUserLocation } from "../services/ubicacionService.mjs";
import { getAlertsWithLocations } from "../services/ubicacionService.mjs";

export const handleUserLocation = async (req, res) => {
  try {
    const { usuarioId, alarmaId, latitud, longitud } = req.body;

    if (!usuarioId || !alarmaId || !latitud || !longitud) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const ubicacion = await saveUserLocation(usuarioId, alarmaId, latitud, longitud);
    return res.status(201).json({ message: "Location saved", ubicacion });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


export const getAllAlerts = async (req, res) => {
  try {
    const alerts = await getAlertsWithLocations();
    return res.status(200).json(alerts);
  } catch (error) {
    console.error("Error fetching alerts:", error);
    return res.status(500).json({ error: "Could not fetch alerts" });
  }
};
