import {
  getAllTicketsService,
  getTicketFromUserService,
  getTicketService,
  updateTicketService,
} from "../services/tickets.services.js";
import { emitTicketChange } from "../utils/main/socketUtils.js";

import { ValidationError } from "../utils/main/errorUtils.js";

export const getAllTicketsController = async (req, res, next) => {
  let limit = parseInt(req.query.limit);
  try {
    let tickets = await getAllTicketsService(limit);

    return res.status(200).json({
      msg:
        tickets < limit
          ? `Mostrando los primeros ${limit} ickets`
          : "Mostrando todos los tickets",
      payload: tickets,
    });
  } catch (error) {
    next(error);
  }
};
export const getTicketController = async (req, res, next) => {
  const idTicket = req.params.tid;

  if (!idTicket || idTicket.length !== 24) {
    return next(new ValidationError("ID de ticket inválido."));
  }
  try {
    let ticket = await getTicketService(idTicket);

    return res.status(200).json({
      msg: `Mostrando ticket con id ${idTicket}`,
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};
export const getTicketsFromUserController = async (req, res, next) => {
  const idUser = req.params.uid;
  if (!idUser || idUser.length !== 24) {
    return next(new ValidationError("ID usuario inválido."));
  }
  try {
    let ticket = await getTicketFromUserService(idUser);

    return res.status(200).json({
      msg: `Mostrando ticket del usuario ${idUser}`,
      payload: ticket,
    });
  } catch (error) {
    next(error);
  }
};

export const editTicketController = async (req, res, next) => {
  const idTicket = req.params.tid;
  if (!idTicket || idTicket.length !== 24) {
    return next(new ValidationError("ID de pedido inválido."));
  }

  const allowedStatuses = [
    "pending",
    "processing",
    "delayed",
    "delivered",
    "cancelled",
  ];
  const { status } = req.body;
  if (!allowedStatuses.includes(status)) {
    return next(new ValidationError("Estado de pedido inválido."));
  }

  try {
    const updatedTicket = await updateTicketService(idTicket, status);

    emitTicketChange(updatedTicket);
    return res.status(200).json({
      msg: `El estado del ticket ${idTicket} ha sido actualizado a ${status}`,
      payload: updatedTicket,
    });
  } catch (error) {
    next(error);
  }
};
