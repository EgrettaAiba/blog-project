import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "../api/api";
import "./CreatePostPage.css";

const schema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  content: z.string().min(1, "Контент обязателен"),
});

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setError("");

    try {
      await api.post("/posts", data);
      navigate("/");
    } catch (err) {
      setError(err.userMessage || "Неизвестная ошибка");
    }
  };

  return (
    <div className="page">
      <div className="page-container parchment">
        <h2 className="page-title">✍️ Начертати летопись</h2>

        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input"
            placeholder="Заглавие летописи"
            {...register("title")}
          />
          {errors.title && (
            <p className="form-error">{errors.title.message}</p>
          )}

          <textarea
            className="textarea"
            rows={8}
            placeholder="Повѣдай слово свое..."
            {...register("content")}
          />
          {errors.content && (
            <p className="form-error">{errors.content.message}</p>
          )}

          <button className="button" type="submit">
            📜 Сохранити летопись
          </button>
        </form>
      </div>
    </div>
  );
}
