import { useEffect, useState } from "react";
import api from "../api/api";
import PostCard from "../components/PostCard";
import "./FavoritesPage.css";

export default function FavoritesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isAuth = !!localStorage.getItem("token");

  useEffect(() => {
    if (!isAuth) {
      setLoading(false);
      return;
    }

    async function loadFavorites() {
      try {
        const res = await api.get("/favorites");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("Не удалось загрузить избранные летописи");
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [isAuth]);

  if (!isAuth) {
    return (
      <div className="page">
        <p>🔒 Войдите, дабы узреть избранные летописи</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="page">
        <p>📜 Загружаем избранное…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-container">
        <h2 className="page-title">⭐ Избранные летописи</h2>

        {posts.length === 0 ? (
          <p>Пока ни одна летопись не добавлена в избранное</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
}
