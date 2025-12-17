import { body } from "express-validator";

export const registerValidator = [
  body("username")
    .notEmpty()
    .withMessage("Username обязателен"),

  body("email")
    .isEmail()
    .withMessage("Некорректный email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Пароль минимум 6 символов"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Некорректный email"),

  body("password")
    .notEmpty()
    .withMessage("Пароль обязателен"),
];
