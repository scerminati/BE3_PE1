import express from "express";

import {
  getAllUsersController,
  makeAdminController,
  makeUserController,
} from "../controllers/users.controllers.js";

import { isAuthenticated, isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsersController);

router.put("/:uid/makeAdmin", isAuthenticated, isAdmin, makeAdminController);
router.put("/:uid/makeUser", isAuthenticated, isAdmin, makeUserController);

export default router;
