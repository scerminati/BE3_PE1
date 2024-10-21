export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(
    "ERROR! code:",
    statusCode,
    ", name:",
    err.name,
    ", message:",
    err.message
  );

  const session = req.originalUrl.startsWith("/api/sessions");
  const api = req.originalUrl.startsWith("/api");
  if (!session && api) {
    // Respuesta para solicitudes API en formato JSON
    res.status(statusCode).json({
      code: statusCode,
      name: err.name,
      message: err.message,
    });
  } else {
    // Respuesta para solicitudes normales (renderización de vistas)
    res.status(statusCode).render("error/error", {
      error: err.name,
      message: err.message,
      code: statusCode,
    });
  }
};
