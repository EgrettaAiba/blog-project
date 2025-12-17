import request from 'supertest';
import app from '../src/app.js';
import { sequelize } from '../src/models/index.js';

let token;
let postId;

beforeAll(async () => {
  await sequelize.sync({ force: true });

  await request(app).post('/api/auth/register').send({
    username: 'like_user',
    email: 'like@test.com',
    password: '123456',
  });

  const login = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'like@test.com',
      password: '123456',
    });

  token = login.body.token;

  const post = await request(app)
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Про лайки',
      content: 'Любят не за что, а вопреки',
    });

  postId = post.body.id;
});

afterAll(async () => {
  await sequelize.close();
});

describe('Лайки', () => {
  test('нельзя лайкнуть без авторизации', async () => {
    const res = await request(app)
      .post(`/api/posts/${postId}/like`);

    expect(res.statusCode).toBe(401);
  });

  test('лайк → unlike → like', async () => {
    const like1 = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(like1.body.liked).toBe(true);

    const unlike = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(unlike.body.liked).toBe(false);

    const like2 = await request(app)
      .post(`/api/posts/${postId}/like`)
      .set('Authorization', `Bearer ${token}`);

    expect(like2.body.liked).toBe(true);
  });
});
