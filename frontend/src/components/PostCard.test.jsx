import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PostCard from "./PostCard";
import api from "../api/api";


jest.mock("../api/api", () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));


jest.mock("./Comments", () => () => <div>💬 Комментарии</div>);

describe("PostCard", () => {
  const post = {
    id: 1,
    title: "Тестовая летопись",
    content: "Слово древнее",
    createdAt: new Date("2025-12-17").toISOString(),
    likesCount: 2,
    likedByMe: false,
    isFavorite: false,
    User: { username: "Летописец" },
  };

  beforeEach(() => {
    localStorage.setItem("token", "test-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("рендерит пост", () => {
    render(<PostCard post={post} />);

    expect(screen.getByText("📜 Тестовая летопись")).toBeInTheDocument();
    expect(screen.getByText("Слово древнее")).toBeInTheDocument();
    expect(screen.getAllByText(/Летописец/).length).toBeGreaterThan(0);
    expect(screen.getByText("💬 Комментарии")).toBeInTheDocument();
  });

  test("лайк работает", async () => {
    api.post.mockResolvedValueOnce({ data: { liked: true } });

    render(<PostCard post={post} />);

    const likeButton = screen.getByTitle("Возлюбити летопись");

    fireEvent.click(likeButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/posts/1/like");
    });
  });

  test("избранное переключается", async () => {
    api.post.mockResolvedValueOnce({ data: { favorite: true } });

    render(<PostCard post={post} />);

    const favButton = screen.getByText("☆");

    fireEvent.click(favButton);

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/favorites/1");
    });
  });
});
