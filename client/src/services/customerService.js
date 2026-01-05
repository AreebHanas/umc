import api from './api';

const customerService = {
  // Get all customers
  getAllCustomers: async () => {
    const response = await api.get('/customers');
    return response;
  },

  // Get customer by ID
  getCustomerById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response;
  },

  // Create new customer
  createCustomer: async (customerData) => {
    const response = await api.post('/customers', customerData);
    return response;
  },

  // Update customer
  updateCustomer: async (id, customerData) => {
    const response = await api.put(`/customers/${id}`, customerData);
    return response;
  },

  // Delete customer
  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response;
  },

  // Search customers
  searchCustomers: async (searchTerm) => {
    const response = await api.get(`/customers/search?q=${searchTerm}`);
    return response;
  },

  // Get customers by type
  getCustomersByType: async (type) => {
    const response = await api.get(`/customers/type/${type}`);
    return response;
  }
,

  // Get customer details including meters, bills, payments
  getCustomerDetails: async (id) => {
    const response = await api.get(`/customers/${id}/details`);
    return response;
  },

  // Download customer report (PDF). opts: { month: 'YYYY-MM', type: 'payments' }
  getCustomerReport: async (id, opts = {}) => {
    const params = new URLSearchParams();
    if (opts.month) params.append('month', opts.month);
    if (opts.type) params.append('type', opts.type);
    const url = `/customers/${id}/report?` + params.toString();
    const response = await api.get(url, { responseType: 'arraybuffer' });
    return response;
  }
};

export default customerService;
