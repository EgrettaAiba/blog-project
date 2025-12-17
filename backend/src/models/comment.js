export default (sequelize, DataTypes) => {
  const Comment = sequelize.define("Comment", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  });

  return Comment;
};
