export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "Error de Validación";
    this.statusCode = 400;
  }
}
export class InsufficientStockError extends Error {
  constructor(message) {
    super(message);
    this.name = "Cantidad de Stock Insuficiente";
    this.statusCode = 400;
  }
}

export class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = "Solicitud Incorrecta";
    this.statusCode = 400;
  }
}

export class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = "Error de Autenticación";
    this.statusCode = 401;
  }
}

export class AuthorizationError extends Error {
  constructor(message) {
    super(message);
    this.name = "Error de Autorización";
    this.statusCode = 403;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "Not Found";
    this.statusCode = 404;
  }
}

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "Error de Conflicto";
    this.statusCode = 409;
  }
}

export class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.name = "Error Interno de Servicio";
    this.statusCode = 500;
  }
}
