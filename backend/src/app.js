import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// DB
import * as db from "./models/index.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import usersRoutes from "./routes/users.js";
import favoritesRoutes from "./routes/favorites.js";
import commentRoutes from "./routes/comments.js";

// Middleware
import errorHandler from "./middleware/errorHandler.js";

const app = express();

app.use(cors());
app.use(express.json());

//API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/comments", commentRoutes);

//TEST
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// DB
try {
  await db.sequelize.sync();
  console.log("DB connected");
} catch (err) {
  console.error("DB connection error:", err);
}

//ERRORS
app.use(errorHandler);

export default app;

await db.sequelize.query(`
  CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts
  USING fts5(title, content, post_id UNINDEXED);
`);

