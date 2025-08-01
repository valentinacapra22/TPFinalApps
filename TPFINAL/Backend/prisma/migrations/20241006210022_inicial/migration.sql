/*
  Warnings:

  - The primary key for the `Alarma` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Alarma` table. All the data in the column will be lost.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `Suscripcion` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fechaHora` to the `Alarma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Alarma` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contrasena` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `direccion` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefono` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vecindarioId` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Alarma" DROP CONSTRAINT "Alarma_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Suscripcion" DROP CONSTRAINT "Suscripcion_usuarioId_fkey";

-- AlterTable
ALTER TABLE "Alarma" DROP CONSTRAINT "Alarma_pkey",
DROP COLUMN "id",
ADD COLUMN     "alarmaId" SERIAL NOT NULL,
ADD COLUMN     "fechaHora" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD CONSTRAINT "Alarma_pkey" PRIMARY KEY ("alarmaId");

-- AlterTable
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "contrasena" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL,
ADD COLUMN     "usuarioId" SERIAL NOT NULL,
ADD COLUMN     "vecindarioId" INTEGER NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId");

-- DropTable
DROP TABLE "Suscripcion";

-- CreateTable
CREATE TABLE "Vecindario" (
    "vecindarioId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,

    CONSTRAINT "Vecindario_pkey" PRIMARY KEY ("vecindarioId")
);

-- CreateTable
CREATE TABLE "Notificacion" (
    "notificacionId" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "notificacion" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Notificacion_pkey" PRIMARY KEY ("notificacionId")
);

-- AddForeignKey
ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_vecindarioId_fkey" FOREIGN KEY ("vecindarioId") REFERENCES "Vecindario"("vecindarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alarma" ADD CONSTRAINT "Alarma_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
