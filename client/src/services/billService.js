import api from './api';

const billService = {
  // Get all bills
  getAllBills: async () => {
    const response = await api.get('/bills');
    return response.data;
  },

  // Get bill by ID
  getBillById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response.data;
  },

  // Get bills by customer ID
  getBillsByCustomerId: async (customerId) => {
    const response = await api.get(`/bills/customer/${customerId}`);
    return response.data;
  },

  // Get unpaid bills (uses database view)
  getUnpaidBills: async () => {
    const response = await api.get('/bills/unpaid');
    return response.data;
  },

  // Get bills by status
  getBillsByStatus: async (status) => {
    const response = await api.get(`/bills/status/${status}`);
    return response.data;
  },

  // Update bill status
  updateBillStatus: async (id, status) => {
    const response = await api.put(`/bills/${id}/status`, { Status: status });
    return response.data;
  },

  // Mark overdue bills
  markOverdueBills: async () => {
    const response = await api.put('/bills/mark-overdue');
    return response.data;
  }
};

export default billService;
