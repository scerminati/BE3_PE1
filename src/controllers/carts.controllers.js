import {
  getAllCartsService,
  getCartService,
  getCartQTService,
  createCartService,
  emptyCartService,
  deleteProductInCartService,
  editProductInCartService,
} from "../services/cart.services.js";

import { NotFoundError, ValidationError } from "../utils/main/errorUtils.js";

import {
  emitCartUpdate,
  emitProductUpdate,
} from "../utils/main/socketUtils.js";

export const getAllCartsController = async (req, res, next) => {
  let limit = parseInt(req.query.limit);

  try {
    const carts = await getAllCartsService(limit);

    return res.status(200).json({
      msg:
        carts.length < limit
          ? `Mostrando los primeros ${carts.length} carritos`
          : "Mostrando todos los carritos",
      payload: carts,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartController = async (req, res, next) => {
  const idCarrito = req.params.cid;

  if (!idCarrito || idCarrito.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }
  try {
    let cart = await getCartService(idCarrito);

    return res.status(200).json({
      msg: `Mostrando carrito con id ${idCarrito}`,
      payload: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCartQTController = async (req, res, next) => {
  const idCarrito = req.params.cid;

  if (!idCarrito || idCarrito.length !== 24) {
    return res.status(401).json({ payload: 0 });
  }
  try {
    let QT = await getCartQTService(idCarrito);

    if (QT === null) {
      return next(new NotFoundError("No se encuentra el carrito con dicho id"));
    }

    return res.status(200).json({
      msg: `Mostrando cantidad de carrito ${idCarrito}`,
      payload: QT,
    });
  } catch (error) {
    next(error);
  }
};

export const createCartController = async (req, res, next) => {
  try {
    const newCart = await createCartService();
    return res.status(201).json({
      msg: `Nuevo carrito creado exitosamente con el id ${newCart._id}`,
      payload: newCart,
    });
  } catch (error) {
    next(error);
  }
};

export const editProductInCartController = async (req, res, next) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }
  const idProducto = req.params.pid;
  if (!idProducto || idProducto.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }
  let quantity = parseInt(req.body.quantity) || null;

  try {
    const { cartUpdated, productVirtual } = await editProductInCartService(
      idCarrito,
      idProducto,
      quantity
    );

    emitProductUpdate(productVirtual);

    emitCartUpdate(cartUpdated);

    return res.status(200).json({
      msg: `El producto ${idProducto} ha sido agregado correctamente al carrito ${idCarrito}`,
      payload: cartUpdated,
    });
  } catch (error) {
    next(error);
  }
};

export const emptyCartController = async (req, res, next) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }
  try {
    const emptyCart = await emptyCartService(idCarrito);

    emitCartUpdate(emptyCart);

    return res.status(200).json({
      msg: `Eliminados todos los productos del carrito con id ${idCarrito}`,
      payload: emptyCart,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductInCartController = async (req, res, next) => {
  const idCarrito = req.params.cid;
  if (!idCarrito || idCarrito.length !== 24) {
    return next(new ValidationError("ID de carrito inválido."));
  }
  const idProducto = req.params.pid;
  if (!idProducto || idProducto.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }

  try {
    let cartModified = await deleteProductInCartService(idCarrito, idProducto);

    emitCartUpdate(cartModified);

    return res.status(200).json({
      msg: `Producto con id ${idProducto} eliminado del carrito con id ${idCarrito}`,
      payload: cartModified,
    });
  } catch (error) {
    next(error);
  }
};
