import userModel from "../models/user.model.js";
import bcrypt from "bcrypt";


export default class UsersMongoDAO {
  find = async () => {
    return await userModel.find({});
  };

  findByEmail = async (email) => {
    return await userModel.findOne({ email: email });
  };

  findById = async (id) => {
    return await userModel.findOne({ _id: id });
  };

  role = async (userId, role) => {
    return await userModel.findOneAndUpdate(
      { _id: userId },
      { role: role },
      {
        new: true,
      }
    );
  };

  create = async (info) => {
    return await userModel.create(info);
  };

  edit = async (userId, newCartId) => {
    return await userModel.findByIdAndUpdate(
      userId,
      { cart: newCartId },
      { new: true } 
    );
  };

  hash = async (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  };

  validate = async (user, password) => {
    return bcrypt.compareSync(password, user.password);
  };

  current = async (id) => {
    return await userModel.findById({ _id: id }).populate("cart");
  };
}
