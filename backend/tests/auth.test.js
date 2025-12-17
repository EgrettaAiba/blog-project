import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/models/index.js";

beforeAll(async () => {
  await sequelize.sync({ force: true }); // чистая БД
});

afterAll(async () => {
  await sequelize.close();
});

describe("Auth", () => {
  test("Регистрация пользователя", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "testuser",
        email: "test@mail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("id");
    expect(res.body.user.email).toBe("test@mail.com");
  });

  test("Логин пользователя", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "test@mail.com",
        password: "123456",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
