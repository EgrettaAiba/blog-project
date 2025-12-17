'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Favorites', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },

      userId: {
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE"
      },

      postId: {
        type: Sequelize.INTEGER,
        references: { model: "Posts", key: "id" },
        onDelete: "CASCADE"
      },

      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false }
    });

    // уникальная связка (пользователь не может сохранить один пост 2 раза)
    await queryInterface.addConstraint("Favorites", {
      fields: ["userId", "postId"],
      type: "unique",
      name: "unique_favorite"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Favorites');
  }
};
