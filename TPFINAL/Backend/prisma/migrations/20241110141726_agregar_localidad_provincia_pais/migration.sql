/*
  Warnings:

  - You are about to drop the column `ciudad` on the `Vecindario` table. All the data in the column will be lost.
  - Added the required column `localidadId` to the `Vecindario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Vecindario" DROP COLUMN "ciudad",
ADD COLUMN     "localidadId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Pais" (
    "paisId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("paisId")
);

-- CreateTable
CREATE TABLE "Provincia" (
    "provinciaId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "paisId" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("provinciaId")
);

-- CreateTable
CREATE TABLE "Localidad" (
    "localidadId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("localidadId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pais_nombre_key" ON "Pais"("nombre");

-- AddForeignKey
ALTER TABLE "Vecindario" ADD CONSTRAINT "Vecindario_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("localidadId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("paisId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("provinciaId") ON DELETE RESTRICT ON UPDATE CASCADE;
