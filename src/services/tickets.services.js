import TicketsRepository from "../DAO/repositories/ticketRepository.js";
import { TicketsDAO } from "../DAO/DAOFactory.js";

import { getUserByIdService } from "./users.services.js";

import {
  InternalServerError,
  NotFoundError,
} from "../utils/main/errorUtils.js";

const ticketService = new TicketsRepository(TicketsDAO);

export const getAllTicketsService = async (limit) => {
  let tickets = await ticketService.getAllTickets();

  if (!tickets) {
    throw new NotFoundError("Error al obtener los tickets");
  }

  if (!isNaN(limit) && limit > 0) {
    tickets = tickets.slice(0, limit);
  }
  return await populateTicketService(tickets);
};

export const getTicketService = async (id) => {
  let ticket = await ticketService.getTicket(id);
  if (!ticket) {
    throw new NotFoundError(`No se encuentra el ticket con el id ${id}`);
  }
  return await populateTicketService(ticket);
};

export const getTicketFromUserService = async (id) => {
  await getUserByIdService(id);

  let tickets = await ticketService.getTicketsFromUser(id);

  if (!tickets || tickets.length === 0) {
    return null;
  }
  return await populateTicketService(tickets);
};

export const createTicketService = async (idUser, prods, amount) => {
  let ticket = {
    code: await generateUniqueTicketCode(),
    purchase_datetime: new Date(),
    user: idUser,
    products: prods,
    amount: amount,
    status: "pending",
  };

  let savedTicket = await ticketService.createTicket(ticket);

  if (!savedTicket) {
    throw new InternalServerError("Error al generar ticket");
  }
  return await populateTicketService(savedTicket);
};

export const updateTicketService = async (id, status) => {
  let ticket = await ticketService.editTicket(id, status);
  if (!ticket) {
    throw new InternalServerError(`No se pudo editar el pedido con id ${id}.`);
  }

  return await populateTicketService(ticket);
};

const generateTicketCode = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const day = String(now.getDate()).padStart(2, "0");
  const hour = String(now.getHours()).padStart(2, "0");
  const minute = String(now.getMinutes()).padStart(2, "0");

  const randomDigits = Math.floor(1000 + Math.random() * 9000);

  const code = `${year}${month}${day}${hour}${minute}${randomDigits}`;

  return code;
};

const generateUniqueTicketCode = async () => {
  let code;
  let existingTicket;

  do {
    code = generateTicketCode();
    existingTicket = await ticketService.getTicketByCode(code);
  } while (existingTicket);

  return code;
};

const populateTicketService = async (cart) => {
  let ticketsPopulate = await ticketService.populateTicket(cart);

  if (!ticketsPopulate) {
    throw new InternalServerError("Error al popular el carrito");
  }

  return ticketsPopulate;
};
