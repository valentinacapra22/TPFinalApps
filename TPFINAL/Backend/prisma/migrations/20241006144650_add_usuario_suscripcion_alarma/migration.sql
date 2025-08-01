CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Suscripcion" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Suscripcion_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Alarma" (
    "id" SERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Alarma_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

ALTER TABLE "Suscripcion" ADD CONSTRAINT "Suscripcion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Alarma" ADD CONSTRAINT "Alarma_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
