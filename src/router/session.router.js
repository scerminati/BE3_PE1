import express from "express";

import {
  getLoggedUserController,
  registerUserController,
  loginUserController,
  logoutUserController,
  cartLinkUpdateController,
} from "../controllers/sessions.controller.js";

import {
  isAuthenticated,
  isNotAuthenticated,
  navigate,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/current", isAuthenticated, getLoggedUserController);
router.get("/cartLink", navigate, cartLinkUpdateController);

router.post("/register", isNotAuthenticated, registerUserController);
router.post("/login", isNotAuthenticated, loginUserController);
router.post("/logout", isAuthenticated, logoutUserController);

export default router;
