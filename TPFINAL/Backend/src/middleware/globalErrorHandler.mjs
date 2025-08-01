// src/middlewares/globalErrorHandler.mjs
const globalErrorHandler = (err, req, res, next) => {
	console.error(err); // Imprimir el error en la consola
	res.status(err.status || 500).json({
		message: err.message || 'Ha ocurrido un error interno del servidor',
	});
};

export default globalErrorHandler;

