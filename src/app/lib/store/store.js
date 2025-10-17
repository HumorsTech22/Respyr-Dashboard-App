// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import profileReducer from "./slices/profileSlice"
import datewiseReducer from "./datewiseSlice";
import statsReducer from "./slices/statsSlice";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    datewise: datewiseReducer,
    stats: statsReducer,
  },
});