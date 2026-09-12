import { createSlice } from "@reduxjs/toolkit"


const UserSlice=createSlice({
    name:"auth",
    initialState:{
    loading:false,
    user:null,
    token:null
    },
    reducers:{
        setUser:(state, action)=>{
            state.user = action.payload;
            return state;
        },
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
        setToken:(state, action) => {
            state.token = action.payload;
        },
    }
});
export const {setUser, setLoading, setToken}=UserSlice.actions;
export default UserSlice.reducer;