export default (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {},
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  Favorite.removeAttribute("id");

  return Favorite;
};
