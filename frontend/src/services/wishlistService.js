import api from './api';

export const getWishlist = () => api.get('/wishlist').then((r) => r.data);
export const addToWishlist = (propertyId) => api.post('/wishlist', { propertyId }).then((r) => r.data);
export const removeFromWishlist = (propertyId) => api.delete(`/wishlist/${propertyId}`).then((r) => r.data);
