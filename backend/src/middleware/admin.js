const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();  // Разрешаем доступ, если пользователь админ
  } else {
    res.status(403).json({ message: 'Доступ запрещен. Требуются права администратора.' });
  }
};

export default isAdmin;
