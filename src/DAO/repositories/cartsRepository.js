export default class CartsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllCarts() {
    return await this.dao.find();
  }
  async getCart(id) {
    return await this.dao.findById(id);
  }

  async createCart(data) {
    return await this.dao.create(data);
  }

  async editCart(id, prods) {
    return await this.dao.edit(id, prods);
  }

  async populateCart(cart) {
    return await this.dao.populate(cart);
  }
}
