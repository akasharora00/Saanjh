import api from "./axios";

export const getAllEvents = async () => {
  const res = await api.get("/events");
  return res.data;
};

export const getEventById = async (id) => {
  const res = await api.get(`/events/${id}`);
  return res.data;
};

export const createEvent = async (formData) => {
  const res = await api.post("/events", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteEvent = async (id) => {
  const res = await api.delete(`/events/${id}`);
  return res.data;
};

export const registerForEvent = async (id) => {
  const res = await api.post(`/events/${id}/register`);
  return res.data;
};

export const cancelRegistration = async (id) => {
  const res = await api.delete(`/events/${id}/register`);
  return res.data;
};

export const getRegisteredStudents = async (id) => {
  const res = await api.get(`/events/${id}/students`);
  return res.data;
};
