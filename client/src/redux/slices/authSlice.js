import { createSlice } from '@reduxjs/toolkit';

// Try to load user from localStorage
const loadUserFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return {
        token,
        user: JSON.parse(user),
        isAuthenticated: true
      };
    }
  } catch (error) {
    // Error loading from storage
  }
  return {
    token: null,
    user: null,
    isAuthenticated: false
  };
};

const initialAuthState = loadUserFromStorage();

const initialState = {
  ...initialAuthState,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      // Save to localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      // Remove from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthError = (state) => state.auth.error;
