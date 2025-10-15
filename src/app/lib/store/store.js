// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from "./slices/profileSlice"
import datewiseReducer from "./datewiseSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    datewise: datewiseReducer,
  },
});