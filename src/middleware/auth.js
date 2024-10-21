//Autenticar el inicio de sesión mediante passport y redirecciones correspondientes

import passport from "passport";
import {
  AuthenticationError,
  AuthorizationError,
  InternalServerError,
} from "../utils/main/errorUtils.js";

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return next(new InternalServerError(err));
      }
      if (!user) {
        return next(new AuthenticationError("Usuario no autenticado"));
      }

      req.user = user;
      next();
    })(req, res, next);
  };
};

export const isNotAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(new InternalServerError(err));
    }
    if (!user) {
      // Si el usuario no está autenticado, permite el acceso a la ruta
      return next();
    }

    return res.redirect("/profile");
  })(req, res, next);
};

// Middleware para verificar si el usuario está autenticado
export const isAuthenticated = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(new InternalServerError(err));
    }
    if (!user) {
      return res.redirect("/login");
    }

    req.user = user;
    next();
  })(req, res, next);
};

export const navigate = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(new InternalServerError(err));
    }
    if (user) {
      req.user = user;
    } else {
      req.user = null;
    }
    next();
  })(req, res, next);
};

// Middleware para verificar si el usuario es administrador
export const isAdmin = (req, res, next) => {
  // Verifica si el rol del usuario es admin
  if (req.user.role !== "admin") {
    return next(
      new AuthorizationError(
        "Acceso denegado, se requiere rol de administrador"
      )
    );
  }
  next();
};

// Middleware para verificar acceso al carrito del usuario
export const isUserCart = (req, res, next) => {
  const { cid } = req.params;

  if (req.user.cart.toString() !== cid) {
    return next(new AuthorizationError("Acceso denegado a este carrito"));
  }
  next();
};

