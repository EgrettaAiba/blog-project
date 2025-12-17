import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import { AuthContext } from "../context/AuthContext";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});

describe("ProtectedRoute", () => {
  test("рендерит children если есть user", () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider
          value={{
            user: { id: 1, username: "Летописец" },
            login: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <ProtectedRoute>
            <div>Секретная летопись</div>
          </ProtectedRoute>
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Секретная летопись")
    ).toBeInTheDocument();
  });
});
