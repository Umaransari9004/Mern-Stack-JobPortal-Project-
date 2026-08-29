import { createSlice } from "@reduxjs/toolkit";

const jobSlice = createSlice({
    name: "job",
    initialState: {
        allJobs: [],
        allAdminJobs: [],
        singleJob: null,
        searchJobByText: "",
        allAppliedJobs: [],
        allSavedJobs: [],
        searchedQuery: {
            title: '',
            type: ''
        },
        totalPages: 1,
        currentPage: 1,
    },
    reducers: {
        // actions
        setAllJobs: (state, action) => {
            state.allJobs = action.payload.jobs;
            state.totalPages = action.payload.totalPages;
            state.currentPage = action.payload.currentPage;
        },
        setSingleJob: (state, action) => {
            state.singleJob = action.payload;
        },
        setAllAdminJobs: (state, action) => {
            state.allAdminJobs = action.payload;
        },
        setSearchJobByText: (state, action) => {
            state.searchJobByText = action.payload;
        },
        setAllAppliedJobs: (state, action) => {
            state.allAppliedJobs = action.payload;
        },
        setAllSavedJobs: (state, action) => {
            state.allSavedJobs = action.payload;

        },
        setSearchedQuery: (state, action) => {
            state.searchedQuery = action.payload;
            state.currentPage = 1; // ✅ reset page on new search
        },
    },

});
export const {
    setAllJobs,
    setSingleJob,
    setAllAdminJobs,
    setSearchJobByText,
    setAllAppliedJobs,
    setAllSavedJobs,
    setSearchedQuery
} = jobSlice.actions;

export default jobSlice.reducer;