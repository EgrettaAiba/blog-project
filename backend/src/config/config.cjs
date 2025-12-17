const path = require("path");

module.exports = {
  development: {
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "database.sqlite"),
    migrationStorage: "sequelize",
    seederStorage: "sequelize",
    migrationStorageTableName: "migrations",
    seederStorageTableName: "seeders",

    define: {
      underscored: true,
    },

    // Пути к миграциям и сидерам
    migrations: path.join(__dirname, "..", "migrations"),
    seeders: path.join(__dirname, "..", "seeders"),
  },

  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
    define: {
      underscored: true,
    },
    migrations: path.join(__dirname, "..", "migrations"),
    seeders: path.join(__dirname, "..", "seeders"),
  },

  production: {
    dialect: "sqlite",
    storage: path.join(__dirname, "..", "database.sqlite"),

    define: {
      underscored: true,
    },

    migrationStorage: "sequelize",
    seederStorage: "sequelize",
    migrationStorageTableName: "migrations",
    seederStorageTableName: "seeders",

    migrations: path.join(__dirname, "..", "migrations"),
    seeders: path.join(__dirname, "..", "seeders"),
  },
};
