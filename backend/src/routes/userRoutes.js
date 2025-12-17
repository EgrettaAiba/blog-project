import express from "express";
import * as userController from "../controllers/userController.js";
import isAuth from "../middleware/auth.js";
import { cacheMiddleware } from "../middleware/cache.js";

const router = express.Router();

router.get("/me", isAuth, userController.getProfile);
router.put("/me", isAuth, userController.updateProfile);
router.delete("/me", isAuth, userController.deleteAccount);

// Поиск пользователей
router.get(
  "/search",
  isAuth,
  cacheMiddleware(60_000),
  userController.searchUsers
);

export default router;
