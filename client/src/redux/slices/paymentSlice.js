import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentService } from '../../services';

// Async thunks
export const fetchPayments = createAsyncThunk(
  'payments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentService.getAllPayments();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const FetchPaymentStats = createAsyncThunk(
  'payments/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:5000/api/payments/stats');
      if (!res.ok) throw new Error('Stats fetch failed');
      return await res.json();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);


export const fetchPaymentById = createAsyncThunk(
  'payments/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment');
    }
  }
);

export const fetchPaymentsByBillId = createAsyncThunk(
  'payments/fetchByBillId',
  async (billId, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentsByBillId(billId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bill payments');
    }
  }
);

export const createPayment = createAsyncThunk(
  'payments/create',
  async (paymentData, { rejectWithValue }) => {
    try {
      const data = await paymentService.createPayment(paymentData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create payment');
    }
  }
);

export const deletePayment = createAsyncThunk(
  'payments/delete',
  async (id, { rejectWithValue }) => {
    try {
      await paymentService.deletePayment(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete payment');
    }
  }
);

export const fetchPaymentStats = createAsyncThunk(
  'payments/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const data = await paymentService.getPaymentStats();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment stats');
    }
  }
);

// Initial state
const initialState = {
  payments: [],
  currentPayment: null,
  stats: null,
  isLoading: false,
  error: null,
  success: false
};

// Slice
const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentPayment: (state) => {
      state.currentPayment = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all payments
      .addCase(fetchPayments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch payment by ID
      .addCase(fetchPaymentById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPayment = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch payments by bill ID
      .addCase(fetchPaymentsByBillId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentsByBillId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentsByBillId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create payment (uses transaction)
      .addCase(createPayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments.push(action.payload.data || action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete payment
      .addCase(deletePayment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.payments = state.payments.filter(p => p.PaymentID !== action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Fetch payment stats
      .addCase(fetchPaymentStats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPaymentStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchPaymentStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccess, clearCurrentPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
