import * as db from "../models/index.js";

export default async function canDeletePost(req, res, next) {
  try {
    console.log("🛑 canDeletePost middleware called");

    const post = await db.Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }

    const isAuthor =
      Number(post.UserId) === Number(req.user.id);
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Нет прав на удаление" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
