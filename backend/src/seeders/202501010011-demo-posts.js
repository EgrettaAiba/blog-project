'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Posts", [
      {
        title: "Welcome to the Blog!",
        content: "This is your first post.",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: "Hello World",
        content: "Example content",
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Posts", null, {});
  }
};
