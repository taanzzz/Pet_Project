import axios from './axios';

export const submitRequest = (petId, data) => axios.post(`/requests/pet/${petId}`, data);
export const getPetRequests = (petId) => axios.get(`/requests/pet/${petId}`);
export const getMyRequests = () => axios.get('/requests/my');
export const updateRequestStatus = (id, status) => axios.patch(`/requests/${id}/status`, { status });
export const cancelRequest = (id) => axios.delete(`/requests/${id}`);
