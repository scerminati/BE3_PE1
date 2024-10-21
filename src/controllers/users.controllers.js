import {
  getAllUsersService,
  makeAdminService,
  makeUserService,
} from "../services/users.services.js";
import { BadRequestError } from "../utils/main/errorUtils.js";

import { emitUserChange } from "../utils/main/socketUtils.js";

export const getAllUsersController = async (req, res, next) => {
  let limit = parseInt(req.query.limit);

  try {
    let users = await getAllUsersService();

    return res.status(200).json({
      msg:
        users < limit
          ? `Mostrando los primeros ${limit} usuarios`
          : "Mostrando todos los usuarios",
      payload: users,
    });
  } catch (error) {
    next(error);
  }
};

export const makeAdminController = async (req, res, next) => {
  const idUser = req.params.uid;

  if (!idUser || idUser.length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }
  try {
    const newAdmin = await makeAdminService(idUser);

    emitUserChange(newAdmin);

    return res.status(200).json({
      msg: `El usuario ${newAdmin.email} es ahora administrado`,
      payload: newAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const makeUserController = async (req, res, next) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }
  const idCurrent = req.user._id;
  if (idCurrent.toString() === idUser) {
    return next(
      new BadRequestError("Actualmente loggeado como Administrador.")
    );
  }

  try {
    const newUser = await makeUserService(idUser);

    emitUserChange(newUser);

    return res.status(201).json({
      msg: `El usuario ${newUser.email} es ahora usuario`,
      payload: newUser,
    });
  } catch (error) {
    next(error);
  }
};
