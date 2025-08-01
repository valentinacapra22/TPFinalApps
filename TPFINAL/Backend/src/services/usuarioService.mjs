import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { registerSchema } from '../validations/userValidations.mjs';

const prisma = new PrismaClient();

export const getAllUsuarios = async () => {
    return await prisma.usuario.findMany();
};

export const getUsuarioById = async (id) => {
    return await prisma.usuario.findUnique({
        where: { usuarioId: parseInt(id) },
    });
};


export const getUsuarioByEmail = async (email) => {
    return await prisma.usuario.findUnique({
        where: { email },
    });
};

export const createUsuario = async (data) => {
    registerSchema.parse(data);

    const { nombre, email, apellido, contrasena, direccion, telefono, vecindarioId, calle1, calle2, depto, piso } = data;
    const existingUser = await prisma.usuario.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('El email ya está en uso');
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    return await prisma.usuario.create({
        data: {
            nombre,
            apellido,
            email,
            contrasena: hashedPassword,
            direccion,
            telefono,
            vecindarioId: parseInt(vecindarioId),
            calle1,
            calle2,
            depto,
            piso,
        },
    });
};

export const updateUsuario = async (id, data) => {
    registerSchema.partial().parse(data);  

    if (data.contrasena) {
        data.contrasena = await bcrypt.hash(data.contrasena, 10);  
    }

    return await prisma.usuario.update({
        where: { usuarioId: parseInt(id) },
        data,
    });
};

export const deleteUsuario = async (id) => {
    return await prisma.usuario.delete({
        where: { usuarioId: parseInt(id) },
    });
};