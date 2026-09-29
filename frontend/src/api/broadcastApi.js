import api from "./axios";

export const createPost = (formData) => {
  return api.post("/broadcast", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getAllPosts = (params = {}) => {
  return api.get("/broadcast", { params });
};

export const getPostById = (id) => {
  return api.get(`/broadcast/${id}`);
};

export const updatePost = (id, formData) => {
  const isMultipart = formData instanceof FormData;
  return api.patch(`/broadcast/${id}`, formData, {
    headers: isMultipart ? { "Content-Type": "multipart/form-data" } : {},
  });
};

export const deletePost = (id) => {
  return api.delete(`/broadcast/${id}`);
};

export const createComment = (postId, content) => {
  return api.post(`/broadcast/${postId}/comments`, { content });
};

export const replyToComment = (commentId, content) => {
  return api.post(`/broadcast/comments/${commentId}/reply`, { content });
};

export const updateComment = (commentId, content) => {
  return api.patch(`/broadcast/comments/${commentId}`, { content });
};

export const deleteComment = (commentId) => {
  return api.delete(`/broadcast/comments/${commentId}`);
};
