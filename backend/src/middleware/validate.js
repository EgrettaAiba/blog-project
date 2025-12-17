import { validationResult } from "express-validator";

export default function validate(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
        message: "Ошибка валидации",
        details: errors.array().map(err => ({
        field: err.path,
        message: err.msg,
  })),
});

  }

  next();
}
