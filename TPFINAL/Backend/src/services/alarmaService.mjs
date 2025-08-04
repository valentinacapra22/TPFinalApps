import { PrismaClient } from "@prisma/client";
import { io } from "../../init.mjs";

const prisma = new PrismaClient();

// Obtener usuario por ID
export const getUsuarioById = async (usuarioId) => {
    return await prisma.usuario.findUnique({
        where: { usuarioId: parseInt(usuarioId) },
        select: { 
            usuarioId: true, 
            nombre: true, 
            apellido: true, 
            vecindarioId: true 
        },
    });
};

// Activar una alarma y notificar a los usuarios del mismo vecindario
export const activarAlarma = async (usuarioId, descripcion, tipo) => {
    const usuario = await prisma.usuario.findUnique({
        where: { usuarioId: usuarioId },
        select: { vecindarioId: true },
    });

    if (!usuario) throw new Error("Usuario no encontrado");

    const alarma = await prisma.alarma.create({
        data: {
            descripcion,
            tipo,
            activo: true,
            usuarioId: usuarioId,
        },
    });

    const usuariosDelVecindario = await prisma.usuario.findMany({
        where: { vecindarioId: usuario.vecindarioId },
        select: { usuarioId: true, nombre: true },
    });

    return { alarma, usuariosDelVecindario };
};

// Obtener todas las alarmas
export const getAllAlarmas = async () => {
    return await prisma.alarma.findMany({
        include: { 
            usuario: true, 
            ubicaciones: true,
        },
    });
};

export const getAllAlarmasByVecindario = async (vecindarioId) => {
    return await prisma.alarma.findMany({
        where: { usuario: { vecindarioId: vecindarioId } },
        include: { usuario: true },
    });
}

// Obtener una alarma por ID
export const getAlarmaById = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.findUnique({
        where: { alarmaId: alarmaId },
        include: { usuario: true },
    });
};

// Crear una nueva alarma
export const createAlarma = async (data) => {
    const { activo, fechaHora, tipo, usuarioId, descripcion } = data;

    if (!tipo || !usuarioId) {
        throw new Error("Todos los campos (tipo, usuarioId) son obligatorios");
    }

    // Crear la alarma
    const alarma = await prisma.alarma.create({
        data: {
            activo: activo !== undefined ? activo : true,
            fechaHora: fechaHora ? new Date(fechaHora) : new Date(),
            tipo,
            usuario: {
                connect: { usuarioId: parseInt(usuarioId) },
            },
        },
        include: {
            usuario: {
                select: { nombre: true, apellido: true, vecindarioId: true }
            }
        }
    });

    // Enviar notificación por socket
    if (alarma.usuario && alarma.usuario.vecindarioId) {
        const notificacion = {
            mensaje: descripcion || `¡Alarma de ${tipo} activada en tu vecindario!`,
            tipo: 'alarma',
            emisor: `${alarma.usuario.nombre} ${alarma.usuario.apellido}`,
            timestamp: new Date().toISOString(),
            vecindarioId: alarma.usuario.vecindarioId,
            alarma: {
                id: alarma.alarmaId,
                tipo: alarma.tipo,
                descripcion: descripcion || `Alarma de ${tipo}`,
                fechaHora: alarma.fechaHora
            }
        };

        // Enviar notificación a todos los usuarios del vecindario
        io.to(`vecindario_${alarma.usuario.vecindarioId}`).emit('nuevaAlarma', notificacion);
        
        console.log(`📢 Alarma enviada al vecindario ${alarma.usuario.vecindarioId}: ${tipo}`);
    }

    return alarma;
};

// Actualizar una alarma existente
export const updateAlarma = async (id, data) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.update({
        where: { alarmaId: alarmaId },
        data: {
            descripcion: data.descripcion,
            activo: data.activo,
            fechaHora: data.fechaHora ? new Date(data.fechaHora) : undefined,
            tipo: data.tipo,
            usuario: data.usuarioId ? { connect: { usuarioId: parseInt(data.usuarioId) } } : undefined,
        },
    });
};

// Eliminar una alarma por ID
export const deleteAlarma = async (id) => {
    const alarmaId = parseInt(id);
    if (isNaN(alarmaId)) throw new Error("ID de alarma inválido");

    return await prisma.alarma.delete({
        where: { alarmaId: alarmaId },
    });
};

export const getEstadisticasPorVecindario = async (vecindarioId) => {
  try {
    // Obtener todas las alarmas del vecindario con información del usuario
    const alarmas = await prisma.alarma.findMany({
      where: {
        usuario: {
          vecindarioId: parseInt(vecindarioId)
        }
      },
      include: {
        usuario: {
          select: {
            nombre: true,
            apellido: true
          }
        }
      }
    });

    // Contar alarmas por tipo
    const estadisticasPorTipo = {};
    const alarmasPorMes = {};
    const alarmasPorUsuario = {};

    alarmas.forEach(alarma => {
      // Estadísticas por tipo
      if (!estadisticasPorTipo[alarma.tipo]) {
        estadisticasPorTipo[alarma.tipo] = 0;
      }
      estadisticasPorTipo[alarma.tipo]++;

      // Estadísticas por mes
      const fecha = new Date(alarma.fechaHora);
      const mesAnio = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
      if (!alarmasPorMes[mesAnio]) {
        alarmasPorMes[mesAnio] = 0;
      }
      alarmasPorMes[mesAnio]++;

      // Estadísticas por usuario
      const nombreUsuario = `${alarma.usuario.nombre} ${alarma.usuario.apellido}`;
      if (!alarmasPorUsuario[nombreUsuario]) {
        alarmasPorUsuario[nombreUsuario] = 0;
      }
      alarmasPorUsuario[nombreUsuario]++;
    });

    // Convertir a arrays para los gráficos
    const datosPorTipo = Object.entries(estadisticasPorTipo).map(([tipo, cantidad]) => ({
      tipo,
      cantidad
    }));

    const datosPorMes = Object.entries(alarmasPorMes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([mes, cantidad]) => ({
        mes,
        cantidad
      }));

    const datosPorUsuario = Object.entries(alarmasPorUsuario)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10) // Top 10 usuarios
      .map(([usuario, cantidad]) => ({
        usuario,
        cantidad
      }));

    return {
      totalAlarmas: alarmas.length,
      datosPorTipo,
      datosPorMes,
      datosPorUsuario,
      alarmasRecientes: alarmas
        .sort((a, b) => new Date(b.fechaHora) - new Date(a.fechaHora))
        .slice(0, 5)
    };
  } catch (error) {
    console.error("Error obteniendo estadísticas:", error);
    throw new Error("No se pudieron obtener las estadísticas");
  }
};
