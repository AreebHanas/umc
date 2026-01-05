import api from './api';

const userService = {
  // Login
  login: async (credentials) => {
    return api.post('/users/login', credentials);
  },

  // Get all users
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response;
  },

  // Create new user
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response;
  },

  // Delete user
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response;
  },

  // Get users by role
  getUsersByRole: async (role) => {
    const response = await api.get(`/users/role/${role}`);
    return response;
  }
};

export default userService;
