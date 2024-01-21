import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null
}

const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signinSuccess : (state,action)=>{
            state.currentUser = action.payload
        },
        updateUserSuccess : (state,action)=>{
            state.currentUser = action.payload
        },
        deleteUserSuccess : (state,action)=>{
            state.currentUser = null
        },
        signoutUserSuccess : (state,action)=>{
            state.currentUser = null
        }
    }
});

export const {signinSuccess,updateUserSuccess,deleteUserSuccess,signoutUserSuccess} = userSlice.actions;

export default userSlice.reducer