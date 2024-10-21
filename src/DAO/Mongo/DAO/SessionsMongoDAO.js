import userModel from "../models/user.model.js";


export default class SessionsMongoDAO {
  current = async (id) => {
    return await userModel.findById({ _id: id }).populate("cart");
  };
}
