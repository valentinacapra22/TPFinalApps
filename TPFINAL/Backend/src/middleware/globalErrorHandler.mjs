const globalErrorHandler = (err, req, res, next) => {
	console.error(err); 
	res.status(err.status || 500).json({
		message: err.message || 'Ha ocurrido un error interno del servidor',
	});
};

export default globalErrorHandler;

