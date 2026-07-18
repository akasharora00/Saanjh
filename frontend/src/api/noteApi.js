import api from "./axios";

export const getAllNotes = async () => {
  const res = await api.get("/notes");
  return res.data;
};

export const getNoteById = async (id) => {
  const res = await api.get(`/notes/${id}`);
  return res.data;
};

export const uploadNote = async (formData) => {
  const res = await api.post("/notes/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteNote = async (id) => {
  const res = await api.delete(`/notes/${id}`);
  return res.data;
};

export const updateNote = async (id, noteData) => {
  const res = await api.patch(`/notes/${id}`, noteData);
  return res.data;
};