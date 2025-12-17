import request from "supertest";
import app from "../src/app.js";
import * as db from "../src/models/index.js";

let authorToken;
let userToken;
let postId;


beforeAll(async () => {

  await request(app)
    .post("/api/auth/register")
    .send({
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

  expect(authorLogin.body.token).toBeDefined();
  authorToken = authorLogin.body.token;


  await request(app)
    .post("/api/auth/register")
    .send({
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

  expect(userLogin.body.token).toBeDefined();
  userToken = userLogin.body.token;
});


describe("📜 Posts", () => {
  test("Гость не может создать пост", async () => {
    const res = await request(app)
      .post("/api/posts")
      .send({
        title: "Без токена",
        content: "test",
      });

    expect(res.status).toBe(401);
  });

  test("Автор может создать пост", async () => {
    const res = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Мой пост",
        content: "Контент",
      });

    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();

    postId = res.body.id;
  });

  test("Автор может удалить СВОЙ пост", async () => {
    const res = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${authorToken}`);

    expect(res.status).toBe(200);
  });

  test("Пользователь не может удалить чужой пост", async () => {
    // создаём пост автором
    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Чужой пост",
        content: "test",
      });

    const res = await request(app)
      .delete(`/api/posts/${post.body.id}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  test("Лайк работает как toggle", async () => {
    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Пост с лайком",
        content: "test",
      });

    // лак
    const like1 = await request(app)
      .post(`/api/posts/${post.body.id}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(like1.status).toBe(200);
    expect(like1.body.liked).toBe(true);

    // анлак
    const like2 = await request(app)
      .post(`/api/posts/${post.body.id}/like`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(like2.status).toBe(200);
    expect(like2.body.liked).toBe(false);
  });

  test("Гость не может лайкать", async () => {
    const post = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${authorToken}`)
      .send({
        title: "Без лайка",
        content: "test",
      });

    const res = await request(app)
      .post(`/api/posts/${post.body.id}/like`);

    expect(res.status).toBe(401);
  });
});
