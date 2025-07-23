import { createSlice } from "@reduxjs/toolkit"


const UserSlice=createSlice({
    name:"auth",
    initialState:{
    loading:false,
    user:null
    },
    reducers:{
        setUser:(state, action)=>{
            state.user = action.payload;
            return state;
        },
        setLoading:(state, action) => {
            state.loading = action.payload;
        },
    }
});
export const {setUser, setLoading}=UserSlice.actions;
export default UserSlice.reducer;