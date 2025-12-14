import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { billService } from '../../services';

// Async thunks
export const fetchBills = createAsyncThunk(
  'bills/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await billService.getAllBills();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bills');
    }
  }
);

export const fetchBillById = createAsyncThunk(
  'bills/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await billService.getBillById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bill');
    }
  }
);

export const fetchBillsByCustomerId = createAsyncThunk(
  'bills/fetchByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const data = await billService.getBillsByCustomerId(customerId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer bills');
    }
  }
);

export const fetchUnpaidBills = createAsyncThunk(
  'bills/fetchUnpaid',
  async (_, { rejectWithValue }) => {
    try {
      const data = await billService.getUnpaidBills();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch unpaid bills');
    }
  }
);

export const fetchBillsByStatus = createAsyncThunk(
  'bills/fetchByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const data = await billService.getBillsByStatus(status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bills by status');
    }
  }
);

export const updateBillStatus = createAsyncThunk(
  'bills/updateStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const data = await billService.updateBillStatus(id, status);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bill status');
    }
  }
);

export const markOverdueBills = createAsyncThunk(
  'bills/markOverdue',
  async (_, { rejectWithValue }) => {
    try {
      const data = await billService.markOverdueBills();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark overdue bills');
    }
  }
);

// Initial state
const initialState = {
  bills: [],
  unpaidBills: [],
  currentBill: null,
  isLoading: false,
  error: null,
  success: false
};

// Slice
const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bills
      .addCase(fetchBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch bill by ID
      .addCase(fetchBillById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBillById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBill = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchBillById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch bills by customer ID
      .addCase(fetchBillsByCustomerId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBillsByCustomerId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchBillsByCustomerId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch unpaid bills
      .addCase(fetchUnpaidBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUnpaidBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.unpaidBills = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchUnpaidBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch bills by status
      .addCase(fetchBillsByStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBillsByStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.bills = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchBillsByStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update bill status
      .addCase(updateBillStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBillStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.bills.findIndex(b => b.BillID === action.payload.data?.BillID);
        if (index !== -1) {
          state.bills[index] = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateBillStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Mark overdue bills
      .addCase(markOverdueBills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(markOverdueBills.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(markOverdueBills.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, clearCurrentBill } = billSlice.actions;
export default billSlice.reducer;
