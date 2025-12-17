import { body } from "express-validator";

export const createPostValidator = [
  body("title")
    .notEmpty()
    .withMessage("Заголовок обязателен"),

  body("content")
    .notEmpty()
    .withMessage("Контент обязателен"),
];
