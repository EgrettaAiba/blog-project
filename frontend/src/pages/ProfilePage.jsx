import { useEffect, useState, useContext } from "react";
import { Navigate } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./ProfilePage.css";

export default function ProfilePage() {
  const { user, login } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // 🔒 защита страницы профиля
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  useEffect(() => {
    api
      .get("/users/me")
      .then((res) => {
        setUsername(res.data.username);
        setEmail(res.data.email);
      })
      .catch((err) => {
        setError(err.userMessage || "Ошибка загрузки профиля");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await api.put("/users/me", {
        username,
        email,
      });

      // обновляем user в контексте
      login({
        token,
        user: res.data,
      });

      setMessage("Профиль обновлён");
    } catch (err) {
      setError(err.userMessage || "Ошибка обновления профиля");
    }
  };

  return (
    <div className="page">
      <div className="page-container parchment narrow">
        <h2 className="page-title">👤 Профиль</h2>

        {message && <p className="success">{message}</p>}
        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button className="button" type="submit">
            💾 Сохранить
          </button>
        </form>
      </div>
    </div>
  );
}
