import { socketServer } from "../../app.js";

export const emitProductUpdate = async (product) => {
  socketServer.emit("Product Update", product);
};

export const emitCartUpdate = async (cart) => {
  socketServer.emit("Cart Update", cart);
};

export const emitProductDelete = async (product) => {
  socketServer.emit("Product Deleted", product);
};

export const emitUserChange = async (user) => {
  socketServer.emit("User Change", user);
};

export const emitTicketChange = async (ticket) => {
  socketServer.emit("Ticket Change", ticket);
};
