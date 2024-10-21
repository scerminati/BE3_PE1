import CartsRepository from "../DAO/repositories/cartsRepository.js";
import { CartsDAO } from "../DAO/DAOFactory.js";

import { getProductService } from "./products.services.js";

import {
  InsufficientStockError,
  InternalServerError,
  NotFoundError,
} from "../utils/main/errorUtils.js";

const cartService = new CartsRepository(CartsDAO);

export const getAllCartsService = async (limit) => {
  let carts = await cartService.getAllCarts();

  if (!carts) {
    throw new NotFoundError("No hay carritos para mostrar");
  }

  if (!isNaN(limit) && limit > 0) {
    carts = carts.slice(0, limit);
  }

  return await populateCartService(carts);
};

export const getCartService = async (id) => {
  let cart = await cartService.getCart(id);

  if (!cart) {
    throw new NotFoundError(`El carrito con id ${id} no exite`);
  }

  return await populateCartService(cart);
};

export const getCartQTService = async (id) => {
  let cart = await cartService.getCart(id);

  let cartQT;
  if (cart) {
    cartQT = cart.products.reduce(
      (total, product) => total + product.quantity,
      0
    );
  }
  return cartQT ? cartQT : 0;
};

export const createCartService = async () => {
  let data = { products: [] };

  let cart = await cartService.createCart(data);

  if (!cart) {
    throw new InternalServerError("Error al crear el carrito");
  }

  return await populateCartService(cart);
};

export const editProductInCartService = async (id, prod, qty) => {
  let cart = await getCartService(id);
  let product = await getProductService(prod);

  let prodIndex = cart.products.findIndex(
    (product) => product.product._id.toString() === prod
  );
  if (qty === null) {
    qty = prodIndex !== -1 ? cart.products[prodIndex].quantity + 1 : 1;
  }


  if (product.stock < qty) {

    throw new InsufficientStockError("No hay suficiente stock del producto");
  }

  product.stock -= qty;

  if (prodIndex !== -1) {
    cart.products[prodIndex].quantity = qty;
  } else {
    cart.products.push({ product: prod, quantity: qty });
  }

  if (product.stock <= 0) {
    product.status = false;
    product.stock = 0;
  }

  let cartEdited = await cartService.editCart(id, cart.products);
  if (!cartEdited) {
    throw new InternalServerError(`Error al editar el carrito con id ${id}`);
  }

  return {
    cartUpdated: await populateCartService(cartEdited),
    productVirtual: product,
  };
};

export const emptyCartService = async (id) => {
  let cart = await cartService.editCart(id, []);

  if (!cart) {
    throw new NotFoundError(`No se encuentra el carrito con id ${id}`);
  }

  return await populateCartService(cart);
};

export const deleteProductInCartService = async (id, prod) => {
  let cart = await getCartService(id);

  let product = cart.products.find(
    (prodCarrito) => prodCarrito.product._id.toString() === prod
  );

  if (!product) {
    throw new NotFoundError(
      `No exite el producto con id ${prod} en el carrito de id ${id}`
    );
  }
  cart.products = cart.products.filter(
    (productToDelete) => productToDelete.product._id.toString() !== prod
  );

  let newCart = await cartService.editCart(id, cart.products);

  if (!newCart) {
    throw new InternalServerError(`No se pudo editar el carrito`);
  }

  return await populateCartService(newCart);
};

export const getVirtualStockService = async (id, prod) => {
  let cart = await getCartService(id);
  let cartProducts = cart.products;

  prod.forEach((product) => {
    const cartProduct = cartProducts.find(
      (cartItem) => cartItem.product._id.toString() === product._id.toString()
    );
    if (cartProduct) {
      const newStock = product.stock - cartProduct.quantity;
      product.stock = newStock >= 0 ? newStock : 0;
      if (product.stock === 0) {
        product.status = false;
      }
    }
  });

  return prod;
};

const populateCartService = async (cart) => {
  let cartsPopulate = await cartService.populateCart(cart);

  if (!cartsPopulate) {
    throw new InternalServerError("Error al popular el carrito");
  }

  return cartsPopulate;
};

export const pushProductInCartService = async (id, prod, qty) => {
  let cart = await getCartService(id);
  let product = await getProductService(prod);

  product.stock -= qty;
  if (product.stock < 0) {
    product.stock = 0;
  }

  cart.products.push({ product: prod, quantity: qty });

  if (product.stock <= 0) {
    product.status = false;
  }

  let cartEdited = await cartService.editCart(id, cart.products);
  if (!cartEdited) {
    throw new InternalServerError(
      `Error al transferir los productos al carrito con id ${id}`
    );
  }

  return {
    cartUpdated: await populateCartService(cartEdited),
    productVirtual: product,
  };
};
