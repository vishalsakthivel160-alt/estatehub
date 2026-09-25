import api from './api';

export const getProperties = (params) => api.get('/properties', { params }).then((r) => r.data);
export const getPropertyById = (id) => api.get(`/properties/${id}`).then((r) => r.data);
export const getMyProperties = () => api.get('/properties/seller/mine').then((r) => r.data);

export const createProperty = (formData) =>
  api.post('/properties', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);

export const updateProperty = (id, formData) =>
  api.put(`/properties/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);

export const deleteProperty = (id) => api.delete(`/properties/${id}`).then((r) => r.data);
export const markAsSold = (id) => api.put(`/properties/${id}/sold`).then((r) => r.data);
