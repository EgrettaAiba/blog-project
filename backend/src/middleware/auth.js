import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as db from '../models/index.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

const isAuth = async (req, res, next) => {
  console.log('JWT_SECRET:', JWT_SECRET);

  const authHeader = req.headers.authorization;
  console.log('AUTH HEADER:', authHeader);

  if (!authHeader) {
    return res.status(401).json({ error: 'Нет токена' });
  }

  const token = authHeader.split(' ')[1];
  console.log('TOKEN:', token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('DECODED:', decoded);

    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT VERIFY ERROR:', err.message);
    return res.status(401).json({ error: 'Неверный токен' });
  }
};

export default isAuth;
console.log('VERIFY JWT_SECRET:', JWT_SECRET);
