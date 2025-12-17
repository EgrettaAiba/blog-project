import { render, screen } from "@testing-library/react";
import HomePage from "./HomePage";
import api from "../api/api";
import { MemoryRouter } from "react-router-dom";

beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});


// мок API
jest.mock("../api/api", () => ({
  get: jest.fn(),
}));

// мок PostCard (чтобы не тащить лайки, эффекты и т.п.)
jest.mock("../components/PostCard", () => ({ post }) => (
  <div>{post.title}</div>
));

describe("HomePage", () => {
  test("рендерит список постов", async () => {
    api.get.mockResolvedValueOnce({
      data: {
        posts: [
          { id: 1, title: "Первая летопись" },
          { id: 2, title: "Вторая летопись" },
        ],
        total: 2,
      },
    });

    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    );

    expect(await screen.findByText("Первая летопись")).toBeInTheDocument();
    expect(await screen.findByText("Вторая летопись")).toBeInTheDocument();
  });
});
