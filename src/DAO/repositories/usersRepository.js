export default class UsersRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllUsers() {
    return await this.dao.find();
  }

  async getUserByEmail(email) {
    return await this.dao.findByEmail(email);
  }

  async getUserById(id) {
    return await this.dao.findById(id);
  }

  async loginUser(email, pass) {
    return await this.dao.login(email, pass);
  }

  async createUser(info) {
    return await this.dao.create(info);
  }

  async updateUserCart(id, cartId) {
    return await this.dao.edit(id, cartId);
  }

  async roleChange(id, role) {
    return await this.dao.role(id, role);
  }

  async createHash(pass) {
    return await this.dao.hash(pass);
  }

  async validatePassword(user, pass) {
    return await this.dao.validate(user, pass);
  }

  async getLoggedUser(id) {
    return await this.dao.current(id);
  }
}
