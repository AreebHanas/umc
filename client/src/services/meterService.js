import api from './api';

const meterService = {
  // Get all meters
  getAllMeters: async () => {
    const response = await api.get('/meters');
    return response.data;
  },

  // Get meter by ID
  getMeterById: async (id) => {
    const response = await api.get(`/meters/${id}`);
    return response.data;
  },

  // Get meters by customer ID
  getMetersByCustomerId: async (customerId) => {
    const response = await api.get(`/meters/customer/${customerId}`);
    return response.data;
  },

  // Create new meter
  createMeter: async (meterData) => {
    const response = await api.post('/meters', meterData);
    return response.data;
  },

  // Update meter
  updateMeter: async (id, meterData) => {
    const response = await api.put(`/meters/${id}`, meterData);
    return response.data;
  },

  // Delete meter
  deleteMeter: async (id) => {
    const response = await api.delete(`/meters/${id}`);
    return response.data;
  },

  // Get meters by status
  getMetersByStatus: async (status) => {
    const response = await api.get(`/meters/status/${status}`);
    return response.data;
  }
};

export default meterService;
