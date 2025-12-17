import { useContext, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";
import "./LoginPage.css";

const schema = z.object({
  email: z.string().email("Некорректная почта"),
  password: z.string().min(6, "Пароль не может быть короче 6 символов"),
});

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirectMessage = location.state?.message;
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
      const res = await api.post("/auth/login", data);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка входа");
    }
  };

  return (
    <div className="page">
      <div className="page-container parchment narrow">
        <h2 className="page-title">🔐 Вход во град</h2>

        {redirectMessage && (
          <p className="notice">{redirectMessage}</p>
        )}

        {error && <p className="error">{error}</p>}

        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <input
            className="input"
            placeholder="Почта электронная"
            {...register("email")}
          />
          {errors.email && (
            <p className="form-error">{errors.email.message}</p>
          )}

          <input
            className="input"
            type="password"
            placeholder="Тайное слово"
            {...register("password")}
          />
          {errors.password && (
            <p className="form-error">{errors.password.message}</p>
          )}

          <button className="button" type="submit">
            🚪 Войти
          </button>
        </form>

        <p className="footer-text">
          Нет учётной записи?{" "}
          <Link to="/register">Начертати новую</Link>
        </p>
      </div>
    </div>
  );
}
