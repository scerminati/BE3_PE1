import ticketModel from "../models/ticket.model.js";

export default class TicketsMongoDAO {
  find = async () => {
    return await ticketModel.find({}).sort({ purchase_datetime: 1 });
  };

  findById = async (id) => {
    return await ticketModel.findById(id);
  };

  findByUser = async (id) => {
    return await ticketModel.find({ user: id });
  };

  create = async (data) => {
    return await ticketModel.create(data);
  };

  edit = async (id, status) => {
    return await ticketModel.findOneAndUpdate(
      { _id: id },
      { status },
      {
        new: true,
      }
    );
  };

  code = async (code) => {
    return await ticketModel.findOne({ code: code });
  };

  populate = async (ticketPopulate) => {
    const ticketsArray = Array.isArray(ticketPopulate)
      ? ticketPopulate
      : [ticketPopulate];

    const populatedTickets = await Promise.all(
      ticketsArray.map(async (ticket) => {
        let populatedTicket = await ticket.populate({
          path: "user",
          select: "id email",
        });

        const date = new Date(ticket.purchase_datetime);
        const options = { day: "2-digit", month: "short", year: "numeric" };

        // Modificaciones
        populatedTicket.readableDate = date
          .toLocaleDateString("es-ES", options)
          .replace(",", "");

        if (typeof populatedTicket.amount === "number") {
          populatedTicket.amount = populatedTicket.amount.toFixed(2);
        }

        populatedTicket.holi = "holi";
        return populatedTicket;
      })
    );

    return populatedTickets.length === 1
      ? populatedTickets[0]
      : populatedTickets;
  };
}
