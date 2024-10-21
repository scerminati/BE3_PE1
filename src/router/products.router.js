import express from "express";

import { uploader } from "../utils/database/multerUtils.js";

import {
  getAllProductsController,
  getProductController,
  createProductController,
  editProductController,
  deleteProductController,
} from "../controllers/products.controllers.js";

import { multerErrorHandler } from "../utils/database/multerUtils.js";

import { isAuthenticated, isAdmin, navigate } from "../middleware/auth.js";

const router = express.Router();

router.get("/", navigate, getAllProductsController);
router.get("/:pid", navigate, getProductController);

router.post(
  "/",
  isAuthenticated,
  isAdmin,
  uploader.single("thumbnail"),
  multerErrorHandler,
  createProductController
);

router.put(
  "/:pid",

  isAuthenticated,
  isAdmin,
  uploader.single("thumbnail"),
  multerErrorHandler,
  editProductController
);

router.delete("/:pid", isAuthenticated, isAdmin, deleteProductController);

export default router;
