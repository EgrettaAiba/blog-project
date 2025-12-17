import * as db from "../models/index.js";
import { Op } from "sequelize";


export async function getProfile(req, res, next) {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ error: "Пользователь не найден" });
    }

    res.json(user);
  } catch (err) {
    next(err);
  }
}


export async function updateProfile(req, res, next) {
  try {
    const { username, email } = req.body;

    await db.User.update(
      { username, email },
      { where: { id: req.user.id } }
    );

    const updatedUser = await db.User.findByPk(req.user.id, {
      attributes: ["id", "username", "email", "role", "createdAt"],
    });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}


export async function deleteAccount(req, res, next) {
  try {
    await db.User.destroy({ where: { id: req.user.id } });
    res.json({ message: "Аккаунт удалён" });
  } catch (err) {
    next(err);
  }
}

export async function searchUsers(req, res, next) {
  try {
    const q = req.query.q || "";

    const users = await db.User.findAll({
      where: {
        [Op.or]: [
          { username: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
        ],
      },
      attributes: ["id", "username", "email", "createdAt"],
      limit: 20,
    });

    res.json(users);
  } catch (err) {
    next(err);
  }
}
