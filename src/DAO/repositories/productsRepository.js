export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  async getAllProducts() {
    return await this.dao.find();
  }
  async getProduct(id) {
    return await this.dao.findById(id);
  }

  async nextId() {
    return await this.dao.nextId();
  }

  async createProduct(product) {
    return await this.dao.create(product);
  }

  async editProduct(id, updateData) {
    return await this.dao.edit(id, updateData);
  }

  async deleteProduct(id) {
    return await this.dao.delete(id);
  }

  async paginateProducts(filter, values) {
    return await this.dao.paginate(filter, values);
  }

  async categoryProducts() {
    return await this.dao.categories();
  }
}
