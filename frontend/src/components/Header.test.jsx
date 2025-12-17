import { render, screen } from "@testing-library/react";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});

describe("Header", () => {
  test("показывает ссылки для авторизованного пользователя", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { username: "Летописец" },
            logout: jest.fn(),
          }}
        >
          <Header />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText("📜 Летописи")).toBeInTheDocument();
    expect(screen.getByText("⭐ Избранное")).toBeInTheDocument();
    expect(screen.getByText("👤 Профиль")).toBeInTheDocument();
    expect(screen.getByText("🚪 Выйти")).toBeInTheDocument();
  });
});
