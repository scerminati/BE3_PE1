import express from "express";

import path from "path";
import __dirname from "./utils/main/dirnameUtils.js";

import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";

import mongoose from "mongoose";
import handlebars from "express-handlebars";
import { helpers } from "./utils/main/handlebarsHelpers.js";

import cartRouter from "./router/cart.router.js";
import productsRouter from "./router/products.router.js";
import sessionRouter from "./router/session.router.js";
import viewsRouter from "./router/views.router.js";
import usersRouter from "./router/users.router.js";
import ticketsRouter from "./router/tickets.router.js";

import { Server } from "socket.io";

import dotenv from "dotenv";

import { errorHandler } from "./middleware/errorHandler.js";

import { sendEmail } from "./config/mail.config.js";
import { NotFoundError } from "./utils/main/errorUtils.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

configureMiddlewares();
connectToDatabase();
configureHandlebars();
configureRoutes();

//Estáticos
app.use(express.static(path.join(__dirname, "../../public")));

app.use((req, res, next) => {
  const error = new NotFoundError("Ruta no válida.");
  next(error);
});

//Manejo de errores
app.use(errorHandler);

//Mensajería de tickets
app.get("/mail", sendEmail);

//Configuración Socket.io
const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export const socketServer = configureSocketServer(httpServer);

//Middlewares
function configureMiddlewares() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  // ** Configura el middleware express-session **

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: process.env.DATABASE_URL,
        mongoOptions: {},
        ttl: 360,
      }),
      secret: process.env.SECRET_PASSPORT,
      resave: false,
      saveUninitialized: false,
    })
  );

  //Passport para autenticación y autorización
  initializePassport();
  app.use(passport.initialize());
  app.use(passport.session());
}

//Conexión a la base de datos
async function connectToDatabase() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("DataBase Connectado");
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
  }
}

// Crear instancia de Handlebars con helpers personalizados
function configureHandlebars() {
  const hbs = handlebars.create({
    helpers: helpers,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
    },
  });

  //Handlebars
  app.engine("hbs", hbs.engine);
  app.set("views", path.join(__dirname, "../../views"));
  app.set("view engine", "hbs");
}

//Rutas
function configureRoutes() {
  app.use("/api/carts", cartRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/sessions", sessionRouter);
  app.use("/api/tickets", ticketsRouter);
  app.use("/", viewsRouter);
}

// Lógica de configuración del servidor de Socket.io
function configureSocketServer(httpServer) {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("A client connected");

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  return io;
}
