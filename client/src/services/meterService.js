import api from './api';

const meterService = {
  // Get all meters
  getAllMeters: async () => {
    const response = await api.get('/meters');
    return response;
  },

  // Get meter by ID
  getMeterById: async (id) => {
    const response = await api.get(`/meters/${id}`);
    return response;
  },

  // Get meters by customer ID
  getMetersByCustomerId: async (customerId) => {
    const response = await api.get(`/meters/customer/${customerId}`);
    return response;
  },

  // Create new meter
  createMeter: async (meterData) => {
    const response = await api.post('/meters', meterData);
    return response;
  },

  // Update meter
  updateMeter: async (id, meterData) => {
    const response = await api.put(`/meters/${id}`, meterData);
    return response;
  },

  // Delete meter
  deleteMeter: async (id) => {
    const response = await api.delete(`/meters/${id}`);
    return response;
  },

  // Get meters by status
  getMetersByStatus: async (status) => {
    const response = await api.get(`/meters/status/${status}`);
    return response;
  }
};

export default meterService;
