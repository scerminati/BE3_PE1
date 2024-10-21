import {
  getAllProductsService,
  getProductService,
  createProductService,
  editProductService,
  deleteProductService,
} from "../services/products.services.js";

import { BadRequestError, ValidationError } from "../utils/main/errorUtils.js";

import {
  emitProductDelete,
  emitProductUpdate,
} from "../utils/main/socketUtils.js";

export const getAllProductsController = async (req, res, next) => {
  let limit = parseInt(req.query.limit);
  try {
    const products = await getAllProductsService(limit);

    return res.status(200).json({
      msg:
        products.length < limit
          ? `Mostrando los primeros ${limit} productos`
          : "Mostrando todos los productos",
      payload: products,
    });
  } catch (error) {
    next(error);
  }
};

export const getProductController = async (req, res, next) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }

  try {
    const productoEncontrado = await getProductService(idProducto);

    return res.status(200).json({
      msg: `Mostrando el producto con id ${idProducto}`,
      payload: productoEncontrado,
    });
  } catch (error) {
    next(error);
  }
};

export const createProductController = async (req, res, next) => {
  const { title, description, code, price, stock, category } = req.body;

  if (!title || typeof title !== "string") {
    return next(
      new BadRequestError(
        "El título es obligatorio y debe ser una cadena de texto."
      )
    );
  }

  if (!description || typeof description !== "string") {
    return next(
      new BadRequestError(
        "La descripción es obligatoria y debe ser una cadena de texto."
      )
    );
  }

  if (!code || isNaN(code) || parseInt(code) <= 0) {
    return next(
      new BadRequestError(
        "El código es obligatorio y debe ser un número positivo."
      )
    );
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    return next(
      new BadRequestError(
        "El precio es obligatorio y debe ser un número positivo."
      )
    );
  }

  if (stock === undefined || isNaN(stock) || parseInt(stock) < 0) {
    return next(
      new BadRequestError(
        "El stock es obligatorio y debe ser un número igual o mayor a 0."
      )
    );
  }

  if (!category || typeof category !== "string") {
    return next(
      new BadRequestError(
        "La categoría es obligatoria y debe ser una cadena de texto."
      )
    );
  }

  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  try {
    let newProduct = {
      title,
      description,
      code: parseInt(code),
      price: parseFloat(price),
      stock: parseInt(stock),
      category,
      thumbnail,
    };

    newProduct = await createProductService(newProduct);

    emitProductUpdate(newProduct);

    res.status(201).json({
      msg: `Producto agregado exitosamente con id ${newProduct._id}`,
      payload: newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const editProductController = async (req, res, next) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }

  const { title, description, code, price, stock, category } = req.body;

  const thumbnail = req.file ? `../images/${req.file.originalname}` : "";

  const updateData = {
    ...(title && { title }),
    ...(description && { description }),
    ...(code && { code: parseInt(code) }),
    ...(price && { price: parseFloat(price) }),
    ...(stock !== undefined && { stock: parseInt(stock) }),
    ...(category && { category }),
    ...(thumbnail && { thumbnail }),
  };

  try {
    const updatedProduct = await editProductService(idProducto, updateData);

    emitProductUpdate(updatedProduct);

    return res.status(200).json({
      msg: `Producto modificado correctamente en el id ${idProducto}`,
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProductController = async (req, res, next) => {
  const idProducto = req.params.pid;

  if (!idProducto || idProducto.length !== 24) {
    return next(new ValidationError("ID de producto inválido."));
  }
  try {
    const deletedProduct = await deleteProductService(idProducto);

    emitProductDelete(deletedProduct);

    return res.status(200).json({
      msg: `Se eliminó el producto con id ${idProducto}`,
      payload: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};
