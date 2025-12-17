import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


jest.mock("./ProfilePage", () => {
  return function ProfilePage() {
    return <div>ProfilePage</div>;
  };
});

jest.mock("./UsersPage", () => {
  return function UsersPage() {
    return <div>UsersPage</div>;
  };
});

import CreatePostPage from "./CreatePostPage";
import FavoritesPage from "./FavoritesPage";
import RegisterPage from "./RegisterPage";

test("pages render without crashing", () => {
  render(
    <MemoryRouter>
      <AuthContext.Provider
        value={{
          user: null,
          login: jest.fn(),
          logout: jest.fn(),
        }}
      >
        <>
          <CreatePostPage />
          <FavoritesPage />
          <RegisterPage />
        </>
      </AuthContext.Provider>
    </MemoryRouter>
  );
});
