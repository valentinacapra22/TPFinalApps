ALTER TABLE "Alarma" DROP CONSTRAINT "Alarma_usuarioId_fkey";

ALTER TABLE "Suscripcion" DROP CONSTRAINT "Suscripcion_usuarioId_fkey";

ALTER TABLE "Alarma" DROP CONSTRAINT "Alarma_pkey",
DROP COLUMN "id",
ADD COLUMN     "alarmaId" SERIAL NOT NULL,
ADD COLUMN     "fechaHora" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD CONSTRAINT "Alarma_pkey" PRIMARY KEY ("alarmaId");

ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "id",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "contrasena" TEXT NOT NULL,
ADD COLUMN     "direccion" TEXT NOT NULL,
ADD COLUMN     "telefono" TEXT NOT NULL,
ADD COLUMN     "usuarioId" SERIAL NOT NULL,
ADD COLUMN     "vecindarioId" INTEGER NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId");

DROP TABLE "Suscripcion";

CREATE TABLE "Vecindario" (
    "vecindarioId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ciudad" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,

    CONSTRAINT "Vecindario_pkey" PRIMARY KEY ("vecindarioId")
);

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

ALTER TABLE "Notificacion" ADD CONSTRAINT "Notificacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_vecindarioId_fkey" FOREIGN KEY ("vecindarioId") REFERENCES "Vecindario"("vecindarioId") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Alarma" ADD CONSTRAINT "Alarma_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("usuarioId") ON DELETE RESTRICT ON UPDATE CASCADE;
