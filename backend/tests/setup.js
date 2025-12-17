import { sequelize } from "../src/models/index.js";

export async function resetDatabase() {
  await sequelize.sync({ force: true });
}
