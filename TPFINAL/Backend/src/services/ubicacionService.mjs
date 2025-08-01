
//========================= NEW VERSION BELOW =========================

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const saveUserLocation = async (usuarioId, alarmaId, latitud, longitud) => {
  try {
    // Ensure that usuarioId is an integer
    const usuarioIdInt = parseInt(usuarioId, 10);

    if (isNaN(usuarioIdInt)) {
      throw new Error("Invalid user ID");
    }

    const nuevaUbicacion = await prisma.ubicacion.create({
      data: {
        usuarioId: usuarioIdInt, // Use the parsed integer here
        alarmaId,
        latitud,
        longitud,
        fechaHora: new Date(),
      },
    });

    return nuevaUbicacion;
  } catch (error) {
    console.error("Error saving location:", error);
    throw new Error("Could not save location");
  }
};

export const getAlertsWithLocations = async () => {
  return await prisma.alarma.findMany({
    include: {
      ubicacion: true, // Ensure locations are included
    },
  });
};