import express from "express";

import {
  viewsPaginateController,
  viewsProductController,
  viewsCartController,
  viewsRTPController,
  viewsRTUController,
  viewsRTTController,
  viewsLoginController,
  viewsRegisterController,
  viewsProfileController,
  viewsTicketController,
} from "../controllers/views.controllers.js";

import {
  isAdmin,
  isUserCart,
  isAuthenticated,
  isNotAuthenticated,
  navigate,
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", navigate, viewsPaginateController);
router.get("/products/:pid", navigate, viewsProductController);

router.get("/carts/:cid", isAuthenticated, isUserCart, viewsCartController);

router.get("/tickets/:tid", isAuthenticated, viewsTicketController);

router.get("/realtimeproducts", isAuthenticated, isAdmin, viewsRTPController);
router.get("/realtimeusers", isAuthenticated, isAdmin, viewsRTUController);
router.get("/realtimetickets", isAuthenticated, isAdmin, viewsRTTController);

router.get("/login", isNotAuthenticated, viewsLoginController);
router.get("/register", isNotAuthenticated, viewsRegisterController);
router.get("/profile", isAuthenticated, viewsProfileController);

export default router;
