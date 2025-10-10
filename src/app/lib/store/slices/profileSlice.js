// store/profileSlice.js
import { createSlice } from '@reduxjs/toolkit';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    personal: null,
    records: [],
    loading: false,
    error: null
  },
  reducers: {
    setProfileData: (state, action) => {
      state.personal = action.payload.personal;
      state.records = action.payload.records;
    },
    setPersonalData: (state, action) => {
      state.personal = action.payload;
    },
    setRecordsData: (state, action) => {
      state.records = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action) => {
      state.error = action.payload;
    },
    clearProfileData: (state) => {
      state.personal = null;
      state.records = [];
      state.error = null;
    }
  }
});

export const {
  setProfileData,
  setPersonalData,
  setRecordsData,
  setProfileLoading,
  setProfileError,
  clearProfileData
} = profileSlice.actions;

export default profileSlice.reducer;