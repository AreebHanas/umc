import api from './api';

const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    const response = await api.get('/customers');
    return response.data;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response.data;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response.data;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  // Search customers
  searchCustomers: async (searchTerm) => {
    const response = await api.get(`/customers/search?q=${searchTerm}`);
    return response.data;
  },

  // Get customers by type
  getCustomersByType: async (type) => {
    const response = await api.get(`/customers/type/${type}`);
    return response.data;
  }
};

export default customerService;
