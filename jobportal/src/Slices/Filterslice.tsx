import { createSlice } from "@reduxjs/toolkit";

const filterslice = createSlice({
    name: 'filter',
    initialState: {
        jobTitle: '',
        location: '',
        jobType: '',
        experience: ''
    },
    reducers: {
        updateFilter: (state, action) => {
            // Correct way to update state in Redux Toolkit
            return { ...state, ...action.payload };
        },
        resetFilter: (state) => {
            return { jobTitle: '', location: '', jobType: '', experience: '' };
        }
    }
});
export const {  updateFilter, resetFilter } =  filterslice.actions;
export default filterslice.reducer;