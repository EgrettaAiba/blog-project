import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "./LoginPage";
import { AuthContext } from "../context/AuthContext";
import api from "../api/api";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});


jest.mock("../api/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe("LoginPage", () => {
  const loginMock = jest.fn();

  const renderPage = () =>
    render(
      <AuthContext.Provider value={{ login: loginMock }}>
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
      </AuthContext.Provider>
    );

  test("рендерится форма логина", () => {
    renderPage();

    expect(screen.getByText("🔐 Вход во град")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Почта электронная")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Тайное слово")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /войти/i })).toBeInTheDocument();
  });

  test("успешный логин вызывает login и редирект", async () => {
    api.post.mockResolvedValueOnce({
      data: {
        token: "test-token",
        user: { id: 1, username: "test" },
      },
    });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Почта электронная"), {
      target: { value: "test@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Тайное слово"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/auth/login", {
        email: "test@test.com",
        password: "123456",
      });
    });

    expect(loginMock).toHaveBeenCalled();
  });

  test("ошибка логина отображается пользователю", async () => {
    api.post.mockRejectedValueOnce({
      response: {
        data: { error: "Неверные данные" },
      },
    });

    renderPage();

    fireEvent.change(screen.getByPlaceholderText("Почта электронная"), {
      target: { value: "wrong@test.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("Тайное слово"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /войти/i }));

    expect(await screen.findByText("Неверные данные")).toBeInTheDocument();
  });
});
