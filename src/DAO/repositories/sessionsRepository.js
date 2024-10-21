export default class SessionsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getLoggedUser(id) {
    return await this.dao.current(id);
  }
}
