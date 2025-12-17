import jwt from "jsonwebtoken";
import * as db from "../models/index.js";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export default async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    req.user = null;
    return next();
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await db.User.findByPk(decoded.id);
    req.user = user || null;
  } catch (err) {
    req.user = null;
  }

  next();
}
