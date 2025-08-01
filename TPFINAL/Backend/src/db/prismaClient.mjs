import { PrismaClient } from '@prisma/client';

// Se crea una única instancia de PrismaClient.
const prisma = new PrismaClient();

// Se exporta esta instancia para que otros archivos puedan usarla.
export default prisma; 