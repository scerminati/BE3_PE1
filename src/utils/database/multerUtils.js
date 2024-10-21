import multer from "multer";
import path from "path";
import __dirname from "../main/dirnameUtils.js";

import { BadRequestError } from "../main/errorUtils.js"; 

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/images"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // Validar que el archivo sea una imagen
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new BadRequestError(
        "Tipo de archivo no permitido. Solo se permiten imágenes."
      ),
      false
    );
  }
};

// Middleware para manejar errores de multer
const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {

    return next(new BadRequestError(err.message));
  } else if (err) {
    
    return next(err);
  }
};

export const uploader = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Exportar el middleware de manejo de errores
export { multerErrorHandler };
