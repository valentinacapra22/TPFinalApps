import bcrypt from 'bcryptjs';
import * as jose from 'jose'; // Cambia a 'jose'
import { getUsuarioByEmail } from './usuarioService.mjs';
import { loginSchema } from '../validations/authValidations.mjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key'); // Asegúrate de usar TextEncoder
const TOKEN_EXPIRATION = '1h';

export const loginUser = async (data) => {
    // Validación con Zod
    loginSchema.parse(data);

    const { email, contrasena } = data;

    // Verificación de usuario
    const user = await getUsuarioByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }

    // Validación de contraseña
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
        throw new Error('Credenciales incorrectas');
    }

    // Generación del token usando jose
    const token = await new jose.SignJWT({ usuarioId: user.usuarioId })
        .setProtectedHeader({ alg: 'HS256' }) // Elige el algoritmo
        .setExpirationTime(TOKEN_EXPIRATION)
        .sign(JWT_SECRET); // Firma el token

    return { token, user };
};

export const validateToken = async (token) => {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return payload.usuarioId; // Cambiado a usuarioId
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};