import { useState } from "react";

export default function Comments({ postId, isAuth }) {
  const storageKey = `comments_post_${postId}`;

  const [comments, setComments] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  });

  const [text, setText] = useState("");

  const addComment = () => {
    if (!text.trim()) return;

    const user =
      JSON.parse(localStorage.getItem("user")) || {};

    const newComment = {
      id: Date.now(),
      author: user.username || "Аноним",
      text,
      date: new Date().toLocaleString("ru-RU"),
    };

    const updated = [...comments, newComment];
    setComments(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setText("");
  };

  return (
    <div style={{ marginTop: "20px" }}>
      <h4>💬 Сказы под летописью</h4>

      {comments.length === 0 && (
        <p style={{ fontSize: "14px", color: "#666" }}>
          Никто ещё не молвил слова…
        </p>
      )}

      {comments.map((c) => (
        <div
          key={c.id}
          style={{
            borderTop: "1px dashed #ccc",
            marginTop: "10px",
            paddingTop: "5px",
          }}
        >
          <strong>{c.author}</strong>{" "}
          <span style={{ fontSize: "12px", color: "#777" }}>
            ({c.date})
          </span>
          <p>{c.text}</p>
        </div>
      ))}

      {isAuth ? (
        <div style={{ marginTop: "10px" }}>
          <textarea
            placeholder="🪶 Начертати сказ…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            style={{ width: "100%" }}
          />
          <button onClick={addComment} style={{ marginTop: "5px" }}>
            🪶 Начертати
          </button>
        </div>
      ) : (
        <p style={{ fontSize: "14px", color: "#888" }}>
          Лишь вошедшие во град могут сказывать
        </p>
      )}
    </div>
  );
}
