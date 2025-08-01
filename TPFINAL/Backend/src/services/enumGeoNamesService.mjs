import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getPais = async () => {
  return await prisma.pais.findMany();
};

export const getProvincia = async (paisId) => {
  const provincia = await prisma.provincia.findMany({
    where: {
      paisId: paisId,
    },
  });

  console.log(provincia);
  return provincia;
};

export const getLocalidad = async (provinciaId) => {
  const localidad = await prisma.localidad.findMany({
    where: {
      provinciaId: provinciaId,
    },
    select: {
      provinciaId: true,
      nombre: true,
    },
  });

  console.log(localidad);
  return localidad;
};
