import * as db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

//helpers
function validationError(message, status = 400) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// Рега
export async function register(req, res, next) {
  try {
    const { username, email, password } = req.body;

    // Валидация вход данных
    if (!username || username.length < 3) {
      throw validationError("Имя пользователя минимум 3 символа");
    }

    if (!email || !email.includes("@")) {
      throw validationError("Некорректный email");
    }

    if (!password || password.length < 6) {
      throw validationError("Пароль минимум 6 символов");
    }

    // Проверка на существующего пользователя
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      throw validationError(
        "Пользователь с таким email уже существует",
        409
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await db.User.create({
      username,
      email,
      password: hash,
    });

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

// Логин
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Валидация
    if (!email || !password) {
      throw validationError("Email и пароль обязательны", 400);
    }

    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      throw validationError("Неверный email или пароль", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw validationError("Неверный email или пароль", 401);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Успешный вход",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export default {
  register,
  login,
};
