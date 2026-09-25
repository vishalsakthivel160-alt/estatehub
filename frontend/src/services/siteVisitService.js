import api from './api';

export const createSiteVisit = (data) => api.post('/site-visits', data).then((r) => r.data);
export const getMySiteVisits = () => api.get('/site-visits/mine').then((r) => r.data);
export const getReceivedSiteVisits = () => api.get('/site-visits/received').then((r) => r.data);
export const respondToSiteVisit = (id, data) =>
  api.put(`/site-visits/${id}`, data).then((r) => r.data);
