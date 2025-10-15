// lib/store/datewiseSlice.js
"use client";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchDatewiseData as apiFetchDatewiseData } from "@/app/services/authService";

// helper: strip time to avoid TZ issues
const stripTime = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export const fetchDatewiseThunk = createAsyncThunk(
  "datewise/fetch",
  async (dateString, { rejectWithValue }) => {
    try {
      const dateObj = new Date(dateString);
      const res = await apiFetchDatewiseData(stripTime(dateObj));
      return res; // {success, data, ...}
    } catch (e) {
      return rejectWithValue(e?.message || "Failed to load datewise data");
    }
  }
);

const initialState = {
  selectedDate: new Date().toISOString(), // Store as ISO string instead of Date object
  data: null,            // full API response
  loading: false,
  error: null,
};

const datewiseSlice = createSlice({
  name: "datewise",
  initialState,
  reducers: {
    setSelectedDate: (state, action) => {
      state.selectedDate = action.payload; // Store the ISO string directly
    },
    // optional manual clear
    clearDatewise(state) {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDatewiseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDatewiseThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload || null;
      })
      .addCase(fetchDatewiseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
        state.data = null;
      });
  },
});

export const { setSelectedDate, clearDatewise } = datewiseSlice.actions;
export default datewiseSlice.reducer;