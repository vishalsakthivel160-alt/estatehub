import api from './api';

export const createOffer = (data) => api.post('/offers', data).then((r) => r.data);
export const getMyOffers = () => api.get('/offers/mine').then((r) => r.data);
export const getReceivedOffers = () => api.get('/offers/received').then((r) => r.data);
export const respondToOffer = (id, action, counterAmount) =>
  api.put(`/offers/${id}`, { action, counterAmount }).then((r) => r.data);
