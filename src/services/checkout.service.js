import { editProductService, getProductService } from "./products.services.js";
import { createTicketService } from "./tickets.services.js";

import {
  getCartService,
  pushProductInCartService,
  createCartService,
} from "./cart.services.js";
import {
  getCurrentLoggedUserService,
  updateUserCartService,
} from "./users.services.js";

import {
  InsufficientStockError,
  ValidationError,
} from "../utils/main/errorUtils.js";

import mongoose from "mongoose";
import { sendEmail } from "../config/mail.config.js";
import { emailBody } from "../utils/session/mailUtils.js";

export const checkoutService = async (userId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let user = await getCurrentLoggedUserService(userId);
    let userCart = await getCartService(user.cart);

    if (!userCart || userCart.products.length === 0) {
      throw new ValidationError(
        `No se puede realizar el checkout, carrito vacío`
      );
    }

    let futureCart = [];
    let currentPurchase = [];
    let newProductPurchase;

    for (const item of userCart.products) {
      const productId = item.product._id;
      const quantityRequested = item.quantity;

      const product = await getProductService(productId);

      if (quantityRequested > product.stock) {
        futureCart.push(item);
      } else {
        const newStock = product.stock - quantityRequested;
        await editProductService(productId, { stock: newStock });
        newProductPurchase = {
          productId: product._id,
          title: product.title,
          quantity: quantityRequested,
          price: product.price,
          totalProduct: product.price * quantityRequested,
        };
        currentPurchase.push(newProductPurchase);
      }
    }

    if (currentPurchase.length == 0) {
      throw new InsufficientStockError(
        `No se puede realizar la compra, los productos dentro del carrito no tienen stock.`
      );
    }
    const totalPrice = currentPurchase.reduce((total, item) => {
      return total + item.totalProduct;
    }, 0);

    let ticket = await createTicketService(userId, currentPurchase, totalPrice);

    let newCart = await createCartService();
    let newUserCart = await updateUserCartService(userId, newCart._id);

    if (futureCart.length > 0) {
      for (const item of futureCart) {
        const { product, quantity } = item;

        await pushProductInCartService(newCart, product._id, quantity);
      }
      ticket.message =
        "Algunos elemenos no pudieron ser procesados, recibirás un correo al respecto.";
    }

    if (!user.email) {
      throw new ValidationError(
        "El correo electrónico del usuario no está definido."
      );
    }
    const mailOptions = await emailBody(
      user,
      currentPurchase,
      totalPrice,
      ticket.code,
      futureCart
    );
    await sendEmail(mailOptions);

    await session.commitTransaction();
    session.endSession();

  
    return ticket;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
