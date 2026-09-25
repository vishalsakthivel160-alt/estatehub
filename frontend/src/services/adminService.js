import api from './api';

export const getStats = () => api.get('/admin/stats').then((r) => r.data);
export const getUsers = () => api.get('/admin/users').then((r) => r.data);
export const toggleBlockUser = (id) => api.put(`/admin/users/${id}/block`).then((r) => r.data);
export const deleteUser = (id) => api.delete(`/admin/users/${id}`).then((r) => r.data);
export const getAllProperties = () => api.get('/admin/properties').then((r) => r.data);
export const updatePropertyStatus = (id, status) =>
  api.put(`/admin/properties/${id}/status`, { status }).then((r) => r.data);
export const deletePropertyAdmin = (id) => api.delete(`/admin/properties/${id}`).then((r) => r.data);
export const getReports = () => api.get('/admin/reports').then((r) => r.data);
export const updateReportStatus = (id, status) => api.put(`/admin/reports/${id}`, { status }).then((r) => r.data);
