import express from "express";
import isAuth from "../middleware/auth.js";
import {
  createComment,
  getPostComments,
} from "../controllers/commentController.js";

const router = express.Router();

router.get("/post/:postId", getPostComments);
router.post("/post/:postId", isAuth, createComment);

export default router;
