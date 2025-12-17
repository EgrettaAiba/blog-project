import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/models/index.js";

let token;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // регистрация
  await request(app)
    .post("/api/auth/register")
    .send({
      username: "user_test",
      email: "user@test.com",
      password: "123456",
    });

  // логин
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "user@test.com",
      password: "123456",
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Пользователь (userController)", () => {
  test("Авторизованный пользователь может получить свой профиль", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
    expect(res.body.email).toBe("user@test.com");
  });

  test("Нельзя получить профиль без авторизации", async () => {
    const res = await request(app)
      .get("/api/users/me");

    expect(res.statusCode).toBe(401);
  });
});
