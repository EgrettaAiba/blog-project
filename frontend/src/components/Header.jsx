import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const { user, logout } = useContext(AuthContext);

  return (
    <header style={{ marginBottom: "20px" }}>
      {/* 📜 Летописи доступны всем */}
      <Link to="/">📜 Летописи</Link>

      <nav
        style={{
          marginLeft: "20px",
          display: "inline-flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        {!user ? (
          <>
            <Link to="/login">🔐 Войти</Link>
            <Link to="/register">📝 Регистрация</Link>
          </>
        ) : (
          <>
            {/* ⭐ Избранное */}
            <Link to="/favorites">⭐ Избранное</Link>

            {/* 🔍 Пользователи */}
            <Link to="/users">👥 Люд честной</Link>

            {/* 👤 Профиль */}
            <Link to="/profile">👤 Профиль</Link>

            {/* 🚪 Выход */}
            <button onClick={logout}>🚪 Выйти</button>
          </>
        )}
      </nav>
    </header>
  );
}
