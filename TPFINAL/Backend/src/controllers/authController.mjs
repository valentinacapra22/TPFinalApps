import * as authService from "../services/authService.mjs";
import catchAsync from "../helpers/catchAsync.mjs";

export const login = catchAsync(async (req, res) => {
  const { email, contrasena } = req.body;

  // Llamada al servicio de autenticación
  const loginData = await authService.loginUser({ email, contrasena });

  // Respuesta exitosa con el token y los datos del usuario
  res.status(200).json({
    message: "Autenticación exitosa",
    token: loginData.token,
    user: loginData.user,
  });
});

export const validateToken = catchAsync(async (req, res) => {
  const { token } = req.body;

  // Llamada al servicio para validar el token
  const usuarioId = await authService.validateToken(token);

  // Respuesta exitosa con el userId
  res.status(200).json({
    message: "Token válido",
    usuarioId,
  });
});