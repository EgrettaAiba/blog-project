import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

import UserModel from "./user.js";
import PostModel from "./post.js";
import CommentModel from "./comment.js";
import PostLikeModel from "./postLike.js";
import FavoriteModel from "./favorite.js";


dotenv.config();

const isTest = process.env.NODE_ENV === "test";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: isTest ? "./database.test.sqlite" : "./database.sqlite",
  logging: false, // чтобы тесты не заспамили консоль
});


const User = UserModel(sequelize, DataTypes);
const Post = PostModel(sequelize, DataTypes);
const Comment = CommentModel(sequelize, DataTypes);
const PostLike = PostLikeModel(sequelize, DataTypes);
const Favorite = FavoriteModel(sequelize, DataTypes);


//АССОЦИАЦИИ

// автор поста
User.hasMany(Post, { foreignKey: "UserId" });
Post.belongsTo(User, { foreignKey: "UserId" });

// комментарии
User.hasMany(Comment, { foreignKey: "UserId" });
Comment.belongsTo(User, { foreignKey: "UserId" });

Post.hasMany(Comment, { foreignKey: "PostId" });
Comment.belongsTo(Post, { foreignKey: "PostId" });


User.hasMany(PostLike, { foreignKey: "UserId" });
PostLike.belongsTo(User, { foreignKey: "UserId" });

Post.hasMany(PostLike, { foreignKey: "PostId" });
PostLike.belongsTo(Post, { foreignKey: "PostId" });

User.hasMany(Favorite, { foreignKey: "UserId" });
Favorite.belongsTo(User, { foreignKey: "UserId" });

Post.hasMany(Favorite, { foreignKey: "PostId" });
Favorite.belongsTo(Post, { foreignKey: "PostId" });


export {
  sequelize,
  User,
  Post,
  Comment,
  PostLike,
  Favorite,
};
