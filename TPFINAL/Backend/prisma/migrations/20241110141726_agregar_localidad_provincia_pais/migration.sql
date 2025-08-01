ALTER TABLE "Vecindario" DROP COLUMN "ciudad",
ADD COLUMN     "localidadId" INTEGER NOT NULL;

CREATE TABLE "Pais" (
    "paisId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Pais_pkey" PRIMARY KEY ("paisId")
);

CREATE TABLE "Provincia" (
    "provinciaId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "paisId" INTEGER NOT NULL,

    CONSTRAINT "Provincia_pkey" PRIMARY KEY ("provinciaId")
);

CREATE TABLE "Localidad" (
    "localidadId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "provinciaId" INTEGER NOT NULL,

    CONSTRAINT "Localidad_pkey" PRIMARY KEY ("localidadId")
);

CREATE UNIQUE INDEX "Pais_nombre_key" ON "Pais"("nombre");

ALTER TABLE "Vecindario" ADD CONSTRAINT "Vecindario_localidadId_fkey" FOREIGN KEY ("localidadId") REFERENCES "Localidad"("localidadId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Provincia" ADD CONSTRAINT "Provincia_paisId_fkey" FOREIGN KEY ("paisId") REFERENCES "Pais"("paisId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Localidad" ADD CONSTRAINT "Localidad_provinciaId_fkey" FOREIGN KEY ("provinciaId") REFERENCES "Provincia"("provinciaId") ON DELETE RESTRICT ON UPDATE CASCADE;
