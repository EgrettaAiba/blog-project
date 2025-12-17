import * as commentsApi from "./comments";

test("comments api exports functions", () => {
  expect(commentsApi).toBeDefined();
});

test("getComments exists", () => {
  expect(typeof commentsApi.getComments).toBe("function");
});

test("addComment exists", () => {
  expect(typeof commentsApi.addComment).toBe("function");
});
