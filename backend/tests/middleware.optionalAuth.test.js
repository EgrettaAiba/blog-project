import jwt from "jsonwebtoken";
import optionalAuth from "../src/middleware/optionalAuth.js";
import { jest } from "@jest/globals";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

describe("optionalAuth middleware (unit)", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      headers: {},
    };
    res = {};
    next = jest.fn();
  });

  test("Если токена нет — запрос не блокируется", () => {
    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("Если токен валидный — запрос не блокируется", () => {
    const token = jwt.sign(
      { id: 123, role: "user" },
      JWT_SECRET
    );

    req.headers.authorization = `Bearer ${token}`;

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("Если токен битый — запрос всё равно не блокируется", () => {
    req.headers.authorization = "Bearer invalid.token.here";

    optionalAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
