import api from './api';

const paymentService = {
  // Get all payments
  getAllPayments: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get payment by ID
  getPaymentById: async (id) => {
    const response = await api.get(`/payments/${id}`);
    return response.data;
  },

  // Get payments by bill ID
  getPaymentsByBillId: async (billId) => {
    const response = await api.get(`/payments/bill/${billId}`);
    return response.data;
  },

  // Create new payment (uses transaction, updates bill status)
  createPayment: async (paymentData) => {
    const response = await api.post('/payments', paymentData);
    return response.data;
  },

  // Delete payment
  deletePayment: async (id) => {
    const response = await api.delete(`/payments/${id}`);
    return response.data;
  },

  // Get payment statistics
  getPaymentStats: async () => {
    const response = await api.get('/payments/stats');
    return response.data;
  }
};

export default paymentService;
