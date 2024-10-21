import {
  getCurrentLoggedUserService,
  loginUserService,
  registerUserService,
  cartLinkUpdateService,
} from "../services/users.services.js";
import { checkoutService } from "../services/checkout.service.js";

import { generateToken } from "../utils/session/webTokenUtil.js";

import { emitTicketChange, emitUserChange } from "../utils/main/socketUtils.js";
import { BadRequestError, ValidationError } from "../utils/main/errorUtils.js";

export const getLoggedUserController = async (req, res, next) => {
  let userId;
  if (!req.user) {
    return next(new ValidationError("ID usuario inválido."));
  }
  userId = req.user._id;

  if (!userId || userId.toString().length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }

  try {
    const user = await getCurrentLoggedUserService(userId);

    res.status(200).send({
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const registerUserController = async (req, res, next) => {
  const { first_name, last_name, password, email, age } = req.body;

  if (!first_name || !last_name || !password || !email || !age) {
    return next(new BadRequestError("Datos de registro incompletos"));
  }
  try {
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password,
    };

    let createdUser = await registerUserService(newUser);

    emitUserChange(createdUser);

    res.cookie("jwt", generateToken(createdUser), {
      httpOnly: true,
      secure: false,
    });

    req.session.welcomeMessage =
      "¡Hola, " + first_name + "! Gracias por registrarte.";
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new BadRequestError("Datos de sesión incompletos"));
  }

  try {
    const user = await loginUserService(email, password);

    // Si la validación es exitosa, genera el JWT y redirige
    res.cookie("jwt", generateToken(user), {
      httpOnly: true,
      secure: false,
    });
    req.session.welcomeMessage = "¡Hola de nuevo, " + user.first_name + "!";
    return res.redirect("/");
  } catch (error) {
    next(error);
  }
};

export const logoutUserController = async (req, res, next) => {
  req.session.welcomeMessage = "¡Hasta pronto!";
  res.clearCookie("jwt");
  res.redirect("/");
};

export const checkoutCartController = async (req, res, next) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }
  let idUser;
  if (!req.user) {
    return next(new ValidationError("ID usuario inválido."));
  }
  idUser = req.user._id;
  const idUserCart = req.user.cart;
  if (!idUser || idUser.toString().length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }

  if (idUserCart != idCarrito) {
    return next(new ValidationError("El carrito no pertenece al usuario."));
  }

  try {
    let ticket = await checkoutService(idUser);

    emitTicketChange(ticket);

    return res
      .status(200)
      .send({ msg: "Compra realizada exitosamente", payload: ticket.message });
  } catch (error) {
    next(error);
  }
};

export const cartLinkUpdateController = async (req, res) => {
  let idUser;
  if (req.user) {
    idUser = req.user._id;
    if (!idUser || idUser.toString().length !== 24) {
      return res.status(204).json({ msg: "Usuario no encontrado" });
    }

    let userCartId = await cartLinkUpdateService(idUser);
    if (!userCartId) {
      return res.status(204).json({ msg: "Carrito no encontrado" });
    } else {
      return res
        .status(200)
        .json({ msg: "Carrito encontrado", payload: userCartId });
    }
  }
  return res.status(204).json({ msg: "Usuario no loggeado" });
};
