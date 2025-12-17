/* istanbul ignore file */
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// добавляем JWT, если он есть
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// централизованная обработка ошибок (БЕЗ очистки storage)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      error.userMessage = "⚠️ Требуется вход в систему";
    } else if (status === 403) {
      error.userMessage = "🚫 У вас нет прав на сие действие";
    } else if (status === 404) {
      error.userMessage = "📜 Ничтоже не обретено";
    } else if (status >= 500) {
      error.userMessage = "🔥 Сервер пал. Попробуйте позже";
    } else {
      error.userMessage = "❗ Ошибка запроса";
    }

    return Promise.reject(error);
  }
);

export default api;
