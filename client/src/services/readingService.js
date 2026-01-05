import api from './api';

const readingService = {
  // Get all readings
  getAllReadings: async () => {
    const response = await api.get('/readings');
    return response;
  },

  // Get reading by ID
  getReadingById: async (id) => {
    const response = await api.get(`/readings/${id}`);
    return response;
  },

  // Get readings by meter ID
  getReadingsByMeterId: async (meterId) => {
    const response = await api.get(`/readings/meter/${meterId}`);
    return response;
  },

  // Get last reading for a meter
  getLastReading: async (meterId) => {
    const response = await api.get(`/readings/meter/${meterId}/last`);
    return response;
  },

  // Create new reading (auto-generates bill via trigger)
  createReading: async (readingData) => {
    const response = await api.post('/readings', readingData);
    return response;
  },

  // Update reading
  updateReading: async (id, readingData) => {
    const response = await api.put(`/readings/${id}`, readingData);
    return response;
  },

  // Delete reading
  deleteReading: async (id) => {
    const response = await api.delete(`/readings/${id}`);
    return response;
  }
};

export default readingService;
