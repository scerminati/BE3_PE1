import productsModel from "../models/products.model.js";

export default class ProductsMongoDAO {
  find = async () => {
    return await productsModel.find({}).sort({ id: 1 });
  };

  findById = async (id) => {
    return await productsModel.findOne({ _id: id });
  };

  nextId = async () => {
    const lastProduct = await productsModel.findOne(
      {},
      {},
      { sort: { id: -1 } }
    );
    return lastProduct ? lastProduct.id + 1 : 1;
  };

  create = async (product) => {
    return await productsModel.create(product);
  };

  edit = async (id, updateData) => {
    return await productsModel.findOneAndUpdate({ _id: id }, updateData, {
      new: true,
    });
  };

  delete = async (id) => {
    return await productsModel.findOneAndDelete({
      _id: id,
    });
  };

  paginate = async (filter, values) => {
    return await productsModel.paginate(filter, values);
  };

  categories = async () => {
    return await productsModel.distinct("category");
  };
}
