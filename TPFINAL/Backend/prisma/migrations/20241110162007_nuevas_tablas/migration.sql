-- AlterTable
ALTER TABLE "Localidad" ALTER COLUMN "localidadId" DROP DEFAULT;
DROP SEQUENCE "Localidad_localidadId_seq";

-- AlterTable
ALTER TABLE "Provincia" ALTER COLUMN "provinciaId" DROP DEFAULT;
DROP SEQUENCE "Provincia_provinciaId_seq";
