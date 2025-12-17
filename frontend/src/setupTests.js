import "@testing-library/jest-dom";

jest.mock("./api/api", () => ({
  __esModule: true,
  default: {
    get: jest.fn(() =>
      Promise.resolve({
        data: {
          username: "test",
          email: "test@test.com",
        },
      })
    ),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    put: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({})),
  },
}));
