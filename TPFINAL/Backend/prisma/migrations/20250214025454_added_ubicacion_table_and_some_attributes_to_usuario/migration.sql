-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "calle1" TEXT,
ADD COLUMN     "calle2" TEXT,
ADD COLUMN     "depto" TEXT,
ADD COLUMN     "piso" TEXT;

-- CreateTable
CREATE TABLE "Ubicacion" (
    "ubicacionId" SERIAL NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "alarmaId" INTEGER NOT NULL,

    CONSTRAINT "Ubicacion_pkey" PRIMARY KEY ("ubicacionId")
);

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ubicacion" ADD CONSTRAINT "Ubicacion_alarmaId_fkey" FOREIGN KEY ("alarmaId") REFERENCES "Alarma"("alarmaId") ON DELETE RESTRICT ON UPDATE CASCADE;
