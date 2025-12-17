import React, { useState, useEffect } from "react";
import Comments from "./Comments";
import LikeButton from "./LikeButton";
import api from "../api/api";

export default function PostCard({ post }) {
  if (!post) return null;

  const author = post.User?.username || "Безымянный летописец";

  const date = new Date(post.createdAt).toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isAuth = !!localStorage.getItem("token");

  const [liked, setLiked] = useState(post.likedByMe || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isFavorite, setIsFavorite] = useState(post.isFavorite || false);

  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingFav, setLoadingFav] = useState(false);

 
  useEffect(() => {
    setLiked(post.likedByMe || false);
    setLikesCount(post.likesCount || 0);
    setIsFavorite(post.isFavorite || false);
  }, [post.id, post.likedByMe, post.likesCount, post.isFavorite]);


  const toggleLike = async () => {
    if (!isAuth || loadingLike) return;

    try {
      setLoadingLike(true);

      const res = await api.post(`/posts/${post.id}/like`);
      const likedNow = res.data.liked;

      setLiked(likedNow);
      setLikesCount((c) => (likedNow ? c + 1 : Math.max(0, c - 1)));
    } catch (err) {
      console.error("Ошибка лайка", err);
    } finally {
      setLoadingLike(false);
    }
  };


  const toggleFavorite = async () => {
    if (!isAuth || loadingFav) return;

    try {
      setLoadingFav(true);

      const res = await api.post(`/favorites/${post.id}`);
      setIsFavorite(res.data.favorite);
    } catch (err) {
      console.error("Ошибка избранного", err);
    } finally {
      setLoadingFav(false);
    }
  };

  return (
    <div
      style={{
        border: "1px solid #c9b27c",
        padding: "15px",
        marginTop: "15px",
        background: "#fffaf0",
      }}
    >
      <h3>📜 {post.title}</h3>

      <p style={{ fontSize: "14px", color: "#555" }}>
        ✒️ Летописец: <strong>{author}</strong>
        <br />
        🕰 Лето сотворения: {date}
      </p>

      <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

      <LikeButton
        liked={liked}
        count={likesCount}
        onClick={toggleLike}
        disabled={!isAuth || loadingLike}
      />

      <button
        onClick={toggleFavorite}
        disabled={!isAuth || loadingFav}
        style={{
          marginLeft: "10px",
          fontSize: "18px",
          background: "none",
          border: "none",
          cursor: "pointer",
        }}
      >
        {isFavorite ? "⭐" : "☆"}
      </button>

      <Comments postId={post.id} isAuth={isAuth} />
    </div>
  );
}
