import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchClinicTestStats } from '../../../services/authService';

// Async thunk for fetching clinic test stats
export const fetchClinicStats = createAsyncThunk(
  'stats/fetchClinicStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetchClinicTestStats();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch clinic stats');
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    clearStats: (state) => {
      state.data = null;
      state.error = null;
    },
    updateStats: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClinicStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClinicStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastUpdated = Date.now();
        state.error = null;
      })
      .addCase(fetchClinicStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.data = null;
      });
  },
});

export const { clearStats, updateStats } = statsSlice.actions;
export default statsSlice.reducer;