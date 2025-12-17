import express from "express";
import isAuth from "../middleware/auth.js";
import {
  addFavorite,
  removeFavorite,
  getFavorites,
} from "../controllers/favoriteController.js";

const router = express.Router();

router.post("/:id", isAuth, addFavorite);
router.get("/", isAuth, getFavorites);
router.delete("/:id", isAuth, removeFavorite);

export default router;
