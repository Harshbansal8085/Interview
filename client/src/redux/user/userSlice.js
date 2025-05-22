import { createSlice } from "@reduxjs/toolkit";
import { deleteUser } from "firebase/auth";

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
}


const userSlice = createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart: (state)=>{
            state.loading = true;
        },
        signInSucces:(state,action)=>{
            state.currentUser = action.payload
            state.loading = false
            state.error = null
        },
        signInFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false;
        },
        updateUserSuccess:(state,action)=>{
            state.currentUser = action.payload
            state.loading = false   
            state.error = null
        },
        updateUserFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },
        updateUserStart:(state)=>{
            state.loading = true
        },
        deleteUserStart:(state)=>{
            state.loading = true
        },
        deleteUserSuccess:(state)=>{
            state.currentUser=null
            state.loading = false
            state.error = null
        },
        deleteUserFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },
        signOutUserStart:(state)=>{
            state.loading = true
        },
        signOutUserSuccess:(state)=>{
            state.currentUser=null
            state.loading = false
            state.error = null
        },
        signOutUserFailure:(state,action)=>{
            state.error = action.payload
            state.loading = false
        },

    }
})

export const {signInStart,signInSucces,signInFailure,updateUserFailure,updateUserSuccess,updateUserStart,deleteUserFailure,deleteUserStart,deleteUserSuccess,signOutUserFailure,signOutUserStart,signOutUserSuccess} = userSlice.actions

export default userSlice.reducer