import api from './api';

export const createEnquiry = (data) => api.post('/enquiries', data).then((r) => r.data);
export const getMyEnquiries = () => api.get('/enquiries/mine').then((r) => r.data);
export const getReceivedEnquiries = () => api.get('/enquiries/received').then((r) => r.data);
export const updateEnquiryStatus = (id, status) =>
  api.put(`/enquiries/${id}`, { status }).then((r) => r.data);
