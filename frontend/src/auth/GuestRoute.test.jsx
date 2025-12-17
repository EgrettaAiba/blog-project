import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import GuestRoute from "./GuestRoute";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});

test("GuestRoute рендерит children если user нет", () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null }}>
        <GuestRoute>
          <div>Гость</div>
        </GuestRoute>
      </AuthContext.Provider>
    </MemoryRouter>
  );

  expect(screen.getByText("Гость")).toBeInTheDocument();
});
