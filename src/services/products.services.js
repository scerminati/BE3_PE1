import ProductsRepository from "../DAO/repositories/productsRepository.js";
import { ProductsDAO } from "../DAO/DAOFactory.js";

import {
  InternalServerError,
  NotFoundError,
} from "../utils/main/errorUtils.js";

const productService = new ProductsRepository(ProductsDAO);

export const getAllProductsService = async (limit) => {
  let products = await productService.getAllProducts();

  if (!products) {
    throw new NotFoundError("Error al obtener los productos");
  }

  if (!isNaN(limit) && limit > 0) {
    products = products.slice(0, limit);
  }
  return products;
};
export const getProductService = async (id) => {
  let product = await productService.getProduct(id);
  if (!product) {
    throw new NotFoundError(`No se encuentra el producto con el id ${id}`);
  }
  return product;
};
export const createProductService = async (productData) => {
  let newProduct = productData;
  let idProd = await productService.nextId();

  newProduct.id = idProd;

  if (newProduct.stock > 0) {
    newProduct.status = true;
  } else {
    newProduct.status = false;
  }

  let product = await productService.createProduct(newProduct);

  if (!product) {
    throw new InternalServerError(`No se pudo crear el nuevo producto.`);
  }
  return product;
};

export const editProductService = async (id, data) => {
  let updateProduct = data;
  if (updateProduct.stock > 0) {
    updateProduct.status = true;
  } else {
    updateProduct.status = false;
  }

  let product = await productService.editProduct(id, updateProduct);

  if (!product) {
    throw new InternalServerError(
      `No se pudo editar el producto con id ${id}.`
    );
  }
  return product;
};

export const deleteProductService = async (id) => {
  let product = await productService.deleteProduct(id);

  if (!product) {
    throw new InternalServerError(
      `No se pudo eliminar el producto con id ${id}.`
    );
  }
  return product;
};

export const paginateProductsService = async (filter, values) => {
  let products = await productService.paginateProducts(filter, values);

  if (!products) {
    throw new InternalServerError(`Error al paginar productos`);
  }
  return products;
};

export const getCategoriesProductsService = async () => {
  let categories = await productService.categoryProducts();

  if (!categories) {
    throw new InternalServerError(`Error al obtener categorías`);
  }
  return categories;
};
