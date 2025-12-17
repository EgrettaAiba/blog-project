import * as db from "../models/index.js";
import { Op } from "sequelize";

//Лента постов (пагинация + поиск + лайки + избранное)
export async function getPosts(req, res, next) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const offset = (page - 1) * limit;
    const q = req.query.q?.trim();
    const userId = req.user?.id || null;

    let postIds = null;

    // полнотекстов поиск
    if (q) {
      const [results] = await db.sequelize.query(
        `
        SELECT post_id
        FROM posts_fts
        WHERE posts_fts MATCH ?
        ORDER BY rank
        LIMIT ? OFFSET ?
        `,
        { replacements: [q + "*", limit, offset] }
      );

      postIds = results.map(r => r.post_id);

      if (postIds.length === 0) {
        return res.json({
          total: 0,
          page,
          pages: 0,
          posts: [],
        });
      }
    }

    const where = postIds ? { id: postIds } : {};

    const { count, rows } = await db.Post.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
      include: [
        { model: db.User, attributes: ["id", "username"] },
      ],
    });

    const ids = rows.map(p => p.id);

    const likes = await db.PostLike.findAll({
      where: { PostId: ids },
    });

    const favorites = userId
      ? await db.Favorite.findAll({
          where: { UserId: userId, PostId: ids },
        })
      : [];

    const posts = rows.map(post => {
      const likesForPost = likes.filter(
        l => l.PostId === post.id
      );

      return {
        ...post.toJSON(),
        likesCount: likesForPost.length,
        likedByMe: userId
          ? likesForPost.some(l => l.UserId === userId)
          : false,
        isFavorite: favorites.some(
          f => f.PostId === post.id
        ),
      };
    });

    res.json({
      total: count,
      page,
      pages: Math.ceil(count / limit),
      posts,
    });
  } catch (err) {
    next(err);
  }
}


// Один пост
export async function getPostById(req, res, next) {
  try {
    const post = await db.Post.findByPk(req.params.id, {
      include: [
        { model: db.User, attributes: ["id", "username"] },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Летопись не найдена" });
    }

    res.json(post);
  } catch (err) {
    next(err);
  }
}

//Создать пост
export async function createPost(req, res, next) {
  try {
    const { title, content } = req.body;

    const post = await db.Post.create({
      title,
      content,
      UserId: req.user.id,
    });

    await db.sequelize.query(
      `DELETE FROM posts_fts WHERE post_id = ?`,
      { replacements: [post.id] }
    );

    await db.sequelize.query(
      `
      INSERT INTO posts_fts (rowid, title, content, post_id)
      VALUES (?, ?, ?, ?)
      `,
      {
        replacements: [post.id, title, content, post.id],
      }
    );

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function likePost(req, res, next) {
  try {
    const postId = Number(req.params.id);
    const userId = req.user.id;

    //проверяем, что пост существует
    const post = await db.Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }

    // проверяем, есть ли лайк
    const existing = await db.PostLike.findOne({
      where: { PostId: postId, UserId: userId },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ liked: false });
    }


    await db.PostLike.create({
      PostId: postId,
      UserId: userId,
    });

    res.json({ liked: true });
  } catch (err) {
    next(err);
  }
}


export async function deletePost(req, res, next) {
  try {
    const post = await db.Post.findByPk(req.params.id);

    if (!post) {
      return res.status(404).json({ error: "Пост не найден" });
    }


    const isAuthor = post.UserId === req.user.id;
    const isAdmin = req.user.role === "admin";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: "Нет прав на удаление" });
    }

    await post.destroy();

    res.json({ message: "Пост удалён" });
  } catch (err) {
    next(err);
  }
}
