import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { meterService } from '../../services';

// Async thunks
export const fetchMeters = createAsyncThunk(
  'meters/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const data = await meterService.getAllMeters();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meters');
    }
  }
);

export const fetchMeterById = createAsyncThunk(
  'meters/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await meterService.getMeterById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meter');
    }
  }
);

export const fetchMetersByCustomerId = createAsyncThunk(
  'meters/fetchByCustomerId',
  async (customerId, { rejectWithValue }) => {
    try {
      const data = await meterService.getMetersByCustomerId(customerId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch customer meters');
    }
  }
);

export const createMeter = createAsyncThunk(
  'meters/create',
  async (meterData, { rejectWithValue }) => {
    try {
      const data = await meterService.createMeter(meterData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meter');
    }
  }
);

export const updateMeter = createAsyncThunk(
  'meters/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await meterService.updateMeter(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meter');
    }
  }
);

export const deleteMeter = createAsyncThunk(
  'meters/delete',
  async (id, { rejectWithValue }) => {
    try {
      await meterService.deleteMeter(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meter');
    }
  }
);

// Initial state
const initialState = {
  meters: [],
  currentMeter: null,
  isLoading: false,
  error: null,
  success: false
};

// Slice
const meterSlice = createSlice({
  name: 'meters',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentMeter: (state) => {
      state.currentMeter = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all meters
      .addCase(fetchMeters.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeters.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meters = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchMeters.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch meter by ID
      .addCase(fetchMeterById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMeterById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentMeter = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchMeterById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch meters by customer ID
      .addCase(fetchMetersByCustomerId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMetersByCustomerId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meters = action.payload.data || action.payload;
        state.error = null;
      })
      .addCase(fetchMetersByCustomerId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create meter
      .addCase(createMeter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createMeter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meters.push(action.payload.data || action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createMeter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update meter
      .addCase(updateMeter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMeter.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.meters.findIndex(m => m.MeterID === action.payload.data?.MeterID);
        if (index !== -1) {
          state.meters[index] = action.payload.data;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateMeter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete meter
      .addCase(deleteMeter.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteMeter.fulfilled, (state, action) => {
        state.isLoading = false;
        state.meters = state.meters.filter(m => m.MeterID !== action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(deleteMeter.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { clearError, clearSuccess, clearCurrentMeter } = meterSlice.actions;
export default meterSlice.reducer;
