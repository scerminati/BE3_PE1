import nodemailer from "nodemailer";
import dotenv from "dotenv";

import { InternalServerError } from "../utils/main/errorUtils.js";

dotenv.config();

const MAILPASS = process.env.MAILPASS;
const MAIL = process.env.MAIL;

const mailConfig = {
  service: "gmail",
  port: 587,
  auth: { user: MAIL, pass: MAILPASS },
};

const transport = nodemailer.createTransport(mailConfig);

// Refactor de la función de envío de correos
export const sendEmail = async (mailOptions) => {
  try {
    await transport.sendMail(mailOptions);
    return { msg: "Correo enviado con éxito" };
  } catch (error) {
    throw new InternalServerError(error.message);
  }
};
