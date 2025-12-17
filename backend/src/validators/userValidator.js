import { body } from "express-validator";

export const updateProfileValidator = [
  body("username")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Username минимум 3 символа"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Некорректный email"),
];
