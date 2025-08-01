import axios from "axios";
const { get } = axios;
import { PrismaClient as prisma } from "@prisma/client";

const API_USERNAME = "neit";
const prismaClient = new prisma();

const cargarPaises = async () => {
  try {
    // Obtener los países desde la API de GeoNames
    const { data } = await get(
      `http://api.geonames.org/searchJSON?q=Argentina&featureClass=A&featureCode=PCLI&username=${API_USERNAME}`,
    );
    const paises = data.geonames;

    // Crear los países en la base de datos
    for (const pais of paises) {
      const paisExistente = await prismaClient.pais.findUnique({
        where: { paisId: pais.geonameId },
      });

      if (!paisExistente) {
        await prismaClient.pais.create({
          data: {
            nombre: pais.countryName,
            paisId: pais.geonameId,
          },
        });
      } else {
        console.log(
          `El país ${pais.countryName} ya existe y no se ha creado de nuevo.`,
        );
      }
    }
    console.log("Países cargados correctamente.");
  } catch (error) {
    console.error("Error cargando países:", error);
  }
};

const cargarProvincias = async (paisGeonameId) => {
  try {
    // Obtener las provincias de un país
    const { data } = await get(
      `http://api.geonames.org/childrenJSON?geonameId=${paisGeonameId}&username=${API_USERNAME}`,
    );
    const provincias = data.geonames;

    // Crear las provincias en la base de datos
    for (const provincia of provincias) {
      const provinciaExistente = await prismaClient.provincia.findUnique({
        where: { provinciaId: provincia.geonameId },
      });

      if (!provinciaExistente) {
        const pais = await prismaClient.pais.findUnique({
          where: { paisId: paisGeonameId },
        });

        if (pais) {
          await prismaClient.provincia.create({
            data: {
              nombre: provincia.name,
              provinciaId: provincia.geonameId,
              paisId: pais.paisId,
            },
          });
        }
      } else {
        console.log(
          `La provincia ${provincia.name} ya existe y no se ha creado de nuevo.`,
        );
      }
    }
    console.log("Provincias cargadas correctamente.");
  } catch (error) {
    console.error("Error cargando provincias:", error);
  }
};

const cargarLocalidades = async (provinciaGeonameId) => {
  try {
    // Obtener las localidades de una provincia
    const { data } = await get(
      `http://api.geonames.org/childrenJSON?geonameId=${provinciaGeonameId}&username=${API_USERNAME}`,
    );
    const localidades = data.geonames;

    // Crear las localidades en la base de datos
    for (const localidad of localidades) {
      const provincia = await prismaClient.provincia.findFirst({
        where: { provinciaId: provinciaGeonameId },
      });

      if (provincia) {
        // Verificar si la localidad ya existe en la base de datos
        const localidadExistente = await prismaClient.localidad.findFirst({
          where: {
            localidadId: localidad.geonameId,
          },
        });

        if (!localidadExistente) {
          await prismaClient.localidad.create({
            data: {
              nombre: localidad.name,
              localidadId: localidad.geonameId,
              provinciaId: provincia.provinciaId,
            },
          });
        } else {
          console.log(
            `La localidad ${localidad.name} ya existe y no se ha creado de nuevo.`,
          );
        }
      }
    }
    console.log("Localidades cargadas correctamente.");
  } catch (error) {
    console.error("Error cargando localidades:", error);
  }
};

// Función principal para ejecutar todo el proceso de carga
export const cargarEnumerativa = async () => {
  try {
    // Cargar los países
    await cargarPaises();

    // Obtener los países desde la base de datos para cargar sus provincias
    const paises = await prismaClient.pais.findMany();
    for (const pais of paises) {
      // Cargar las provincias por cada país
      await cargarProvincias(pais.paisId);

      // Obtener las provincias desde la base de datos para cargar sus localidades
      const provincias = await prismaClient.provincia.findMany({
        where: { paisId: pais.id },
      });
      for (const provincia of provincias) {
        // Cargar las localidades por cada provincia
        await cargarLocalidades(provincia.provinciaId);
      }
    }
    console.log();
  } catch (error) {
    console.error("Error en la carga de enumerativa:", error);
  } finally {
    await prismaClient.$disconnect();
  }
};
