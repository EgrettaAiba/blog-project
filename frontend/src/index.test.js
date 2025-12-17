jest.mock("react-dom/client", () => ({
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
}));

test("index.js runs without crashing", () => {
  expect(() => {
    require("./index");
  }).not.toThrow();
});
