import {createSlice} from "@reduxjs/toolkit";

const initialState={
    userId:null,
    token:null,
    userName:''
}

const UserSlice=createSlice({
    name:'User',
    initialState,
    reducers:{
        updateuserId(state,action){
            state.userId=action.payload;
        },
        updatetoken(state,action){
            state.token=action.payload
        },
        updateUsername(state,action)
        {
            state.userName=action.payload
        }
    }
})
export const{updateuserId,updatetoken,updateUsername}=UserSlice.actions;
export default UserSlice.reducer;
