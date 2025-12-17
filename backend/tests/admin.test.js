import request from "supertest";
import app from "../src/app.js";
import * as db from "../src/models/index.js";

describe("Admin access", () => {
  let authorToken;
  let userToken;
  let adminToken;
  let postId;

  beforeAll(async () => {
    await db.sequelize.sync({ force: true });

    // AUTHOR
    await request(app).post("/api/auth/register").send({
      username: "author",
      email: "author@test.com",
      password: "123456",
    });

    const authorLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "author@test.com",
        password: "123456",
      });

    authorToken = authorLogin.body.token;
    expect(authorToken).toBeDefined();

    // USER
    await request(app).post("/api/auth/register").send({
      username: "user",
      email: "user@test.com",
      password: "123456",
    });

    const userLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "user@test.com",
        password: "123456",
      });

    userToken = userLogin.body.token;
    expect(userToken).toBeDefined();

    // ADMIN
    await request(app).post("/api/auth/register").send({
      username: "admin",
      email: "admin@test.com",
      password: "123456",
    });

    await db.User.update(
      { role: "admin" },
      { where: { email: "admin@test.com" } }
    );

    const adminLogin = await request(app)
      .post("/api/auth/login")
      .send({
        email: "admin@test.com",
        password: "123456",
      });

    adminToken = adminLogin.body.token;
    expect(adminToken).toBeDefined();

    // пост создаёт автор
    const postRes = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Чужой пост",
        content: "Тест",
      });

    postId = postRes.body.id;
    expect(postId).toBeDefined();
  });

  test("Обычный пользователь НЕ может удалить чужой пост", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(403);
  });

  test("Админ МОЖЕТ удалить чужой пост", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
  });
});
