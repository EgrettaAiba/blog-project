import api from "./api";

export const getComments = (postId) =>
  api.get(`/comments/post/${postId}`);

export const createComment = (postId, content) =>
  api.post(`/comments/post/${postId}`, { content });
