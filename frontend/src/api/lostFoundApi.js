import api from "./axios";

export const createReport = (formData) => {
  return api.post("/lost-found", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllReports = (params = {}) => {
  return api.get("/lost-found", { params });
};

export const getReportById = (id) => {
  return api.get(`/lost-found/${id}`);
};

export const updateReport = (id, formData) => {
  const isMultipart = formData instanceof FormData;
  return api.patch(`/lost-found/${id}`, formData, {
    headers: isMultipart
      ? { "Content-Type": "multipart/form-data" }
      : {},
  });
};

export const deleteReport = (id) => {
  return api.delete(`/lost-found/${id}`);
};

export const claimItem = (id) => {
  return api.patch(`/lost-found/${id}/claim`);
};

export const resolveReport = (id) => {
  return api.patch(`/lost-found/${id}/resolve`);
};
