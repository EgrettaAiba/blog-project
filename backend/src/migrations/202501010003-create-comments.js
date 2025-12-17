'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comments', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      text: { type: Sequelize.STRING, allowNull: false },
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
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Comments');
  }
};
