import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/api";
import PostCard from "../components/PostCard";

import "./HomePage.css";

export default function HomePage() {
  const location = useLocation();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const limit = 5;


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts", {
        params: {
          page,
          limit,
          q: debouncedSearch || undefined,
        },
      });

      setPosts(Array.isArray(res.data?.posts) ? res.data.posts : []);
      setTotal(typeof res.data?.total === "number" ? res.data.total : 0);
    } catch (err) {
      console.error("Ошибка чтения летописей", err);
      setPosts([]);
      setTotal(0);
    }
  };


  useEffect(() => {
    fetchPosts();
  }, [page, debouncedSearch, location.key]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="page">
      <div className="home-header">
        <h2>📜 Летописная лента</h2>

        <input
          className="search-input"
          type="text"
          placeholder="🔍 Сыщи летопись..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link to="/posts/create">
          <button className="primary-btn">
            ✍️ Начертати летопись
          </button>
        </Link>
      </div>

      {posts.length === 0 && (
        <p className="empty">
          Ничтоже не сыскалося…
        </p>
      )}

      <div className="posts-list">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          ⬅️ Назадъ
        </button>

        <span>
          Лето {page} из {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Вперёдъ ➡️
        </button>
      </div>
    </div>
  );
}
