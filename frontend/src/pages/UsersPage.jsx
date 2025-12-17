/* istanbul ignore file */
import { useEffect, useState } from "react";
import api from "../api/api";
import "./UsersPage.css";

export default function UsersPage() {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    const timeout = setTimeout(() => {
      api
        .get(`/users/search?q=${query}`)
        .then((res) => setUsers(res.data))
        .catch(() => {
          setError("Ошибка поиска пользователей");
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="page">
      <div className="page-container parchment narrow">
        <h2 className="page-title">🔍 Поиск людей</h2>

        <input
          className="input"
          placeholder="Введи имя или почту"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setError("");
          }}
        />

        {error && <p className="error">{error}</p>}

        <ul className="user-list">
          {users.map((u) => (
            <li key={u.id} className="user-item">
              👤 <strong>{u.username}</strong>
              <span className="email"> — {u.email}</span>
            </li>
          ))}
        </ul>

        {query && users.length === 0 && !error && (
          <p className="empty">Никого не сыскалося…</p>
        )}
      </div>
    </div>
  );
}
