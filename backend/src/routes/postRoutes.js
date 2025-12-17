import express from "express";
import * as postController from "../controllers/postController.js";
import isAuth from "../middleware/auth.js";
import optionalAuth from "../middleware/optionalAuth.js";
import canDeletePost from "../middleware/canDeletePost.js";

const router = express.Router();

// 📜 Лента постов (гость / авторизованный)
router.get("/", optionalAuth, postController.getPosts);

// 📜 Один пост
router.get("/:id", optionalAuth, postController.getPostById);

// ✍️ Создать пост
router.post("/", isAuth, postController.createPost);

// ❤️ Лайк (toggle)
router.post("/:id/like", isAuth, postController.likePost);

// 🗑 Удалить пост (автор ИЛИ admin)
router.delete(
  "/:id",
  isAuth,
  canDeletePost,
  postController.deletePost
);

export default router;
