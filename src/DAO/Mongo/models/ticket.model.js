import mongoose from "mongoose";

const ticketCollection = "ticket";

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  title: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  totalProduct: { type: Number, required: true },
});

const ticketSchema = new mongoose.Schema({
  code: { type: Number, required: true, unique: true },
  purchase_datetime: { type: Number, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  products: [productSchema],
  amount: { type: Number, required: true },
  status: { type: String, default: "pending" },
});

const ticketModel = mongoose.model(ticketCollection, ticketSchema);

export default ticketModel;
