import axios from './axios';

export const getAllPets = (params) => axios.get('/pets', { params });
export const getPetById = (id) => axios.get(`/pets/${id}`);
export const getMyPets = () => axios.get('/pets/my-listings');
export const createPet = (data) => axios.post('/pets', data);
export const updatePet = (id, data) => axios.put(`/pets/${id}`, data);
export const deletePet = (id) => axios.delete(`/pets/${id}`);
