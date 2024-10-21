import ProductsMongoDAO from "./Mongo/DAO/ProductsMongoDAO.js";
import CartsMongoDAO from "./Mongo/DAO/CartsMongoDAO.js";
import UsersMongoDAO from "./Mongo/DAO/UsersMongoDAO.js";
import TicketsMongoDAO from "./Mongo/DAO/TicketsMongoDAO.js";

import { PERSISTENCE } from "../config/persistence.config.js";

import { InternalServerError } from "../utils/main/errorUtils.js";

const persistence = PERSISTENCE;

let ProductsDAO;
let CartsDAO;
let UsersDAO;
let TicketsDAO;

switch (persistence) {
  case "MONGO":
    ProductsDAO = new ProductsMongoDAO();
    CartsDAO = new CartsMongoDAO();
    UsersDAO = new UsersMongoDAO();
    TicketsDAO = new TicketsMongoDAO();
    break;

  default:
    throw new InternalServerError("Método de PERSISTENCE no soportada");
}

export { ProductsDAO, CartsDAO, UsersDAO, TicketsDAO };
