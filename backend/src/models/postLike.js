export default (sequelize, DataTypes) => {
  const PostLike = sequelize.define(
    "PostLike",
    {},
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  PostLike.removeAttribute("id");

  return PostLike;
};
