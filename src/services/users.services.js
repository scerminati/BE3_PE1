import UsersRepository from "../DAO/repositories/usersRepository.js";
import { UsersDAO } from "../DAO/DAOFactory.js";

import UserDTO from "../DAO/DTO/user.DTO.js";

import { createCartService } from "./cart.services.js";

import {
  AuthenticationError,
  ConflictError,
  InternalServerError,
  NotFoundError,
} from "../utils/main/errorUtils.js";

const userService = new UsersRepository(UsersDAO);

export const getAllUsersService = async (limit) => {
  let users = await userService.getAllUsers();

  if (!users) {
    throw new NotFoundError("No hay usuarios para mostrar");
  }

  if (!isNaN(limit) && limit > 0) {
    users = users.slice(0, limit);
  }

  return users.map((user) => new UserDTO(user));
};

export const getUserByEmailService = async (email) => {
  let user = await userService.getUserByEmail(email);

  if (!user) {
    throw new NotFoundError(`No se encuentra el usuario con email ${email}`);
  }

  return new UserDTO(user);
};

export const getUserByIdService = async (id) => {
  let user = await userService.getUserById(id);

  if (!user) {
    throw new NotFoundError(`No se encuentra el usuario con el id ${id}`);
  }

  return new UserDTO(user);
};

export const makeAdminService = async (id) => {
  let user = await getUserByIdService(id);

  user = await userService.roleChange(id, "admin");

  if (!user) {
    throw new InternalServerError(`Error al cambiar el rol del usuario`);
  }
  return new UserDTO(user);
};

export const makeUserService = async (id) => {
  let user = await getUserByIdService(id);

  user = await userService.roleChange(id, "user");

  if (!user) {
    throw new InternalServerError(`Error al cambiar el rol del usuario`);
  }
  return new UserDTO(user);
};

export const getCurrentLoggedUserService = async (id) => {
  let user = await userService.getLoggedUser(id);
  if (!user) {
    throw new NotFoundError(`No se encuentra el usuario con id ${id}`);
  }

  return new UserDTO(user);
};

export const registerUserService = async (data) => {
  let user = await userService.getUserByEmail(data.email);
  if (user) {
    throw new ConflictError(`El correo electrónico ya está en uso.`);
  }

  let newUser = data;
  newUser.password = await userService.createHash(newUser.password);

  newUser.role = "user";

  let cart = await createCartService();
  newUser.cart = cart._id;

  let register = await userService.createUser(newUser);
  if (!register) {
    throw new InternalServerError(`No se pudo registrar el usuario`);
  }

  return new UserDTO(register);
};

export const loginUserService = async (email, password) => {
  let user = await userService.getUserByEmail(email);
  if (!user) {
    throw new AuthenticationError(`Correo o constraseña incorrecta`);
  }
  let validation = await userService.validatePassword(user, password);
  if (!validation) {
    throw new AuthenticationError(`Correo o constraseña incorrecta`);
  }

  return new UserDTO(user);
};

export const cartLinkUpdateService = async (id) => {
  let user = await userService.getUserById(id);
  if (!user) {
    return null;
  } else return user.cart._id;
};

export const updateUserCartService = async (userId, cartId) => {
  let newUserCart = await userService.updateUserCart(userId, cartId);

  if (!newUserCart) {
    throw new InternalServerError(
      `Error al asignar el nuevo carrito al usuario.`
    );
  }

  return newUserCart
};
