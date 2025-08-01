import bcrypt from 'bcryptjs';
import * as jose from 'jose'; 
import { getUsuarioByEmail } from './usuarioService.mjs';
import { loginSchema } from '../validations/authValidations.mjs';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default_secret_key'); // Asegúrate de usar TextEncoder
const TOKEN_EXPIRATION = '1h';

export const loginUser = async (data) => {
    loginSchema.parse(data);

    const { email, contrasena } = data;
    const user = await getUsuarioByEmail(email);
    if (!user) {
        throw new Error('Usuario no encontrado');
    }
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid) {
        throw new Error('Credenciales incorrectas');
    }

    const token = await new jose.SignJWT({ usuarioId: user.usuarioId })
        .setProtectedHeader({ alg: 'HS256' }) 
        .setExpirationTime(TOKEN_EXPIRATION)
        .sign(JWT_SECRET); 

    return { token, user };
};

export const validateToken = async (token) => {
    try {
        const { payload } = await jose.jwtVerify(token, JWT_SECRET);
        return payload.usuarioId; 
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};