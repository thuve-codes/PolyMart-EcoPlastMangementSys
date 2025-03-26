import axios from 'axios';

const API_URL = 'http://localhost:5000/api/requests'; // Replace with your backend URL

const plasticRequestService = {
  getAllRequests: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },
  getRequestById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },
  createRequest: async (requestData) => {
    const response = await axios.post(API_URL, requestData);
    return response.data;
  },
  updateRequest: async (id, requestData) => {
    const response = await axios.put(`${API_URL}/${id}`, requestData);
    return response.data;
  },
  deleteRequest: async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};

export default plasticRequestService;