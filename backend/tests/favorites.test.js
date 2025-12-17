import request from "supertest";
import app from "../src/app.js";
import { sequelize } from "../src/models/index.js";

let token;
let postId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // регистрация
  await request(app)
    .post("/api/auth/register")
    .send({
      username: "fav_user",
      email: "fav@test.com",
      password: "123456",
    });

  // логин
  const loginRes = await request(app)
    .post("/api/auth/login")
    .send({
      email: "fav@test.com",
      password: "123456",
    });

  token = loginRes.body.token;

  // создание поста
  const postRes = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({
      title: "Избранное слово",
      content: "Что любо сердцу — то в закладках",
    });

  postId = postRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe("Избранные посты (favorites)", () => {
  test("Авторизованный пользователь может добавить пост в избранное", async () => {
    const res = await request(app)
      .post(`/api/favorites/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("favorite");
    expect(res.body.favorite).toBe(true);
  });

  test("Повторный запрос убирает пост из избранного (toggle)", async () => {
    const res = await request(app)
      .post(`/api/favorites/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.favorite).toBe(false);
  });

  test("Можно получить список избранных постов", async () => {
    // снова добавляем
    await request(app)
      .post(`/api/favorites/${postId}`)
      .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
      .get("/api/favorites")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test("Нельзя работать с избранным без авторизации", async () => {
    const res = await request(app)
      .post(`/api/favorites/${postId}`);

    expect(res.statusCode).toBe(401);
  });
});
