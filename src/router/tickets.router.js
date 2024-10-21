import express from "express";

import {
  getAllTicketsController,
  getTicketController,
  getTicketsFromUserController,
  editTicketController,
} from "../controllers/tickets.controller.js";

import { isAuthenticated, isAdmin, isUserCart } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllTicketsController);
router.get("/:tid", isAuthenticated, getTicketController);
router.get("/:tid/user/:uid", isAuthenticated, getTicketsFromUserController);

router.put("/:tid", isAuthenticated, isAdmin, editTicketController);

export default router;
