import * as db from "../../src/models/index.js";

export async function resetDatabase() {
  await db.sequelize.sync({ force: true });
}
