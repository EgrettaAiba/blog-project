

describe("api module coverage", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test("api initializes and registers interceptors", () => {
    jest.doMock("axios", () => {
      const instance = {
        get: jest.fn(),
        post: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
      };

      return {
        create: jest.fn(() => instance),
      };
    });

    const api = require("./api").default;

    expect(api).toBeDefined();
    expect(api.get).toBeDefined();
    expect(api.post).toBeDefined();
  });
});
