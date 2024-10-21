export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllTickets() {
    return await this.dao.find();
  }

  async getTicket(id) {
    return await this.dao.findById(id);
  }

  async getTicketsFromUser(id) {
    return await this.dao.findByUser(id);
  }

  async createTicket(data) {
    return await this.dao.create(data);
  }

  async editTicket(id, status) {
    return await this.dao.edit(id, status);
  }

  async populateTicket(tickets) {
    return await this.dao.populate(tickets);
  }

  async getTicketByCode(code) {
    return await this.dao.code(code);
  }
}
