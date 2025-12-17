import * as db from "../models/index.js";

// создать комментарий
export async function createComment(req, res, next) {
  try {
    const { content } = req.body;
    const { postId } = req.params;

    if (!content) {
      const err = new Error("Комментарий не может быть пустым");
      err.status = 400;
      throw err;
    }

    const post = await db.Post.findByPk(postId);
    if (!post) {
      const err = new Error("Пост не найден");
      err.status = 404;
      throw err;
    }

    const comment = await db.Comment.create({
      content,
      UserId: req.user.id,
      PostId: postId,
    });

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

//получить комментарии поста
export async function getPostComments(req, res, next) {
  try {
    const { postId } = req.params;

    const comments = await db.Comment.findAll({
      where: { PostId: postId },
      include: [
        {
          model: db.User,
          attributes: ["id", "username"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    res.json(comments);
  } catch (err) {
    next(err);
  }
}
