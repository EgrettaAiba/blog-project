import * as db from "../models/index.js";

// toggle-избранное
export async function addFavorite(req, res, next) {
  try {
    const postId = req.params.id;
    const userId = req.user.id;

    const existing = await db.Favorite.findOne({
      where: { UserId: userId, PostId: postId },
    });

    if (existing) {
      await existing.destroy();
      return res.json({ favorite: false });
    }

    await db.Favorite.create({
      UserId: userId,
      PostId: postId,
    });

    res.json({ favorite: true });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const postId = req.params.id;

    await db.Favorite.destroy({
      where: {
        UserId: req.user.id,
        PostId: postId,
      },
    });

    res.json({ favorite: false });
  } catch (err) {
    next(err);
  }
}

//избранные посты
export async function getFavorites(req, res, next) {
  try {
    const userId = req.user.id;

    const favorites = await db.Favorite.findAll({
      where: { UserId: userId },
    });

    const postIds = favorites.map(f => f.PostId);

    if (postIds.length === 0) {
      return res.json([]);
    }

    const posts = await db.Post.findAll({
      where: { id: postIds },
      include: [{ model: db.User, attributes: ["id", "username"] }],
      order: [["createdAt", "DESC"]],
    });

    const likes = await db.PostLike.findAll({
      where: { PostId: postIds },
    });

    const result = posts.map(post => {
      const likesForPost = likes.filter(
        l => l.PostId === post.id
      );

      return {
        ...post.toJSON(),
        likesCount: likesForPost.length,
        likedByMe: likesForPost.some(l => l.UserId === userId),
        isFavorite: true,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}
