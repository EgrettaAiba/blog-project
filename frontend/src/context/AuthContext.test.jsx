import React from "react";
import { render } from "@testing-library/react";
import { AuthContext } from "./AuthContext";

test("AuthContext provides default values", () => {
  let contextValue;

  render(
    <AuthContext.Consumer>
      {(value) => {
        contextValue = value;
        return null;
      }}
    </AuthContext.Consumer>
  );

  expect(contextValue).toBeDefined();
  expect(contextValue.user).toBe(null);
});
