import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

let token;
let postId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  // регистрируем владельца поста
  await request(app).post('/api/auth/register').send({
    username: 'owner',
    email: 'owner@test.com',
    password: '123456'
  });

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'owner@test.com',
    password: '123456'
  });

  token = loginRes.body.token;

  // создаём пост
  const postRes = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Чужое слово',
      content: 'Не тебе писано'
    });

  postId = postRes.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

test('нельзя удалить чужой пост', async () => {
  // другой пользователь
  await request(app).post('/api/auth/register').send({
    username: 'enemy',
    email: 'enemy@test.com',
    password: '123456'
  });

  const enemyLogin = await request(app).post('/api/auth/login').send({
    email: 'enemy@test.com',
    password: '123456'
  });

  const enemyToken = enemyLogin.body.token;

  const res = await request(app)
    .delete(`/api/posts/${postId}`)
    .set('Authorization', `Bearer ${enemyToken}`);

  expect(res.statusCode).toBe(403);
});

test('удаление несуществующего поста', async () => {
  const res = await request(app)
    .delete('/api/posts/9999')
    .set('Authorization', `Bearer ${token}`);

  expect(res.statusCode).toBe(404);
});
