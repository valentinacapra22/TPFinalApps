import dotenv from 'dotenv';
import express from "express";
import vecindarioRoutes from "./routes/vecindarioRoutes.mjs";
import alarmaRoutes from "./routes/alarmaRoutes.mjs";
import usuarioRoutes from "./routes/usuarioRoutes.mjs";
import notificacionRoutes from "./routes/notificacionRoutes.mjs";
import enumGeoNamesRoutes from "./routes/enumGeoNamesRoutes.mjs";
import authRoutes from "./routes/authRoutes.mjs"; // Importa las rutas de autenticación
import morgan from "morgan";
import cors from "cors";
import globalErrorHandler from "./middleware/globalErrorHandler.mjs";
import ubicacionRoutes from "./routes/ubicacionRoutes.mjs";
import historialNotificacionesRoutes from "./routes/historialNotificacionesRoutes.mjs";

// Cargar variables de entorno
dotenv.config();
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(
  cors({
    origin: ["http://localhost:8081", "http://localhost:3001"], 
    credentials: true, // Si usas cookies o autenticación basada en sesión
  })
);

// Ruta básica para la raíz
app.get("/", (_req, res) => {
  res.status(200).send("Bienvenido a la API de VegiNet");
});

// Rutas de autenticación
app.use("/api/auth", authRoutes); // Aquí defines la ruta base para autenticación

// Rutas de vecindarios
app.use("/api/vecindarios", vecindarioRoutes);

// Rutas de alarmas
app.use("/api/alarmas", alarmaRoutes);

// Rutas de notificaciones
app.use("/api/notificaciones", notificacionRoutes);

// Rutas de historial de notificaciones
app.use("/api/historial", historialNotificacionesRoutes);

// Rutas de Usuario
app.use("/api/usuarios", usuarioRoutes);

// Rutas de Enumerativa
app.use("/api/enumGeoNames", enumGeoNamesRoutes);

// Rutas de ubicación
app.use("/api/ubicaciones", ubicacionRoutes);

// Middleware de manejo de errores
app.use(globalErrorHandler);

export default app;
