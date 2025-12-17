'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert("Users", [
      {
        username: "admin",
        email: "admin@example.com",
        password: "$2b$10$abcdefghijklmnopqrstuv",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: "demo",
        email: "demo@example.com",
        password: "$2b$10$abcdefghijklmnopqrstuv",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", null, {});
  }
};
