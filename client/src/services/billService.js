import api from './api';

const billService = {
  // Get all bills
  getAllBills: async () => {
    const response = await api.get('/bills');
    return response;
  },

  // Get bill by ID
  getBillById: async (id) => {
    const response = await api.get(`/bills/${id}`);
    return response;
  },

  // Get bills by customer ID
  getBillsByCustomerId: async (customerId) => {
    const response = await api.get(`/bills/customer/${customerId}`);
    return response;
  },

  // Get unpaid bills (uses database view)
  getUnpaidBills: async () => {
    const response = await api.get('/bills/unpaid');
    return response;
  },

  // Get bills by status
  getBillsByStatus: async (status) => {
    const response = await api.get(`/bills/status/${status}`);
    return response;
  },

  // Update bill status
  updateBillStatus: async (id, status) => {
    const response = await api.put(`/bills/${id}/status`, { Status: status });
    return response;
  },

  // Mark overdue bills
  markOverdueBills: async () => {
    const response = await api.put('/bills/mark-overdue');
    return response;
  }
,

  // Download single bill PDF report
  getBillReport: async (id) => {
    const response = await api.get(`/bills/${id}/report`, { responseType: 'arraybuffer' });
    return response;
  }
};

export default billService;
