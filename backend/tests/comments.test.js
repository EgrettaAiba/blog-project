import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

let token;
let postId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // регистрация
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'comment_user',
      email: 'comment@test.com',
      password: '123456'
    });

  // логин
  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'comment@test.com',
      password: '123456'
    });

  token = loginRes.body.token;

  // создание поста
  const postRes = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Слово летописное',
      content: 'Писано пером, не вырубишь топором'
    });

  postId = postRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Комментарии', () => {
  test('Авторизованный пользователь может оставить комментарий', async () => {
    const res = await request(app)
      .post(`/api/comments/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Добро слово — злато.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.content).toBe('Добро слово — злато.');
  });

  test('Нельзя оставить пустой комментарий', async () => {
    const res = await request(app)
      .post(`/api/comments/post/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: '' });

    expect(res.statusCode).toBe(400);
  });

  test('Можно получить комментарии поста', async () => {
    const res = await request(app)
      .get(`/api/comments/post/${postId}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('Нельзя комментировать без авторизации', async () => {
    const res = await request(app)
      .post(`/api/comments/post/${postId}`)
      .send({ content: 'Без грамоты — без слова.' });

    expect(res.statusCode).toBe(401);
  });
});
