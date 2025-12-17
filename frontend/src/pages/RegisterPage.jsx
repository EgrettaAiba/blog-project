import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./RegisterPage.css";

export default function RegisterPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      // 🔥 РЕГИСТРАЦИЯ, А НЕ ПРОФИЛЬ
      const res = await api.post("/auth/register", {
        username: form.username,
        email: form.email,
        password: form.password,
      });

      // если бэк сразу возвращает token
      if (res.data.token) {
        login({
          token: res.data.token,
          user: res.data.user,
        });
        navigate("/");
      } else {
        setMessage("✅ Регистрация успешна. Теперь войдите.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.userMessage || "Ошибка регистрации");
    }
  };

  return (
    <div className="page">
      <div className="page-container parchment narrow">
        <h2 className="page-title">📝 Регистрация</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            name="username"
            placeholder="Имя пользователя"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          🔥ПАРОЛЬ
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="button" type="submit">
            🪶 Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  );
}
