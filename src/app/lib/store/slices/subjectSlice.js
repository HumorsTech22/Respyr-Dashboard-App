// store/slices/subjectSlice.js
import { createSlice } from '@reduxjs/toolkit';

const subjectSlice = createSlice({
    name: 'subject',
    initialState: {
        currentSubject: null
    },
    reducers: {
        setCurrentSubject: (state, action) => {
            state.currentSubject = action.payload;
        },
        clearCurrentSubject: (state) => {
            state.currentSubject = null;
        }
    }
});

export const { setCurrentSubject, clearCurrentSubject } = subjectSlice.actions;
export default subjectSlice.reducer;