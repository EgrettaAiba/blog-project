import * as db from "../models/index.js";

export default async function canDeleteComment(req, res, next) {
  try {
    const comment = await db.Comment.findByPk(req.params.id);

    if (!comment) {
      return res.status(404).json({ error: "Комментарий не найден" });
    }

    if (req.user.role === "admin") {
      return next();
    }

    if (comment.userId !== req.user.id) {
      return res.status(403).json({ error: "Нет прав" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
