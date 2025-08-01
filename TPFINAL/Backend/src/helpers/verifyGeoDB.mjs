import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyGeoDB = async () => {
  const pais = await prisma.pais.findMany();
  if (pais.length === 0) {
    console.log("No se encontraron países en la base de datos");
    return true;
  }
  console.log("Se encontraron países en la base de datos");
  return false;
};
