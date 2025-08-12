import {createSlice} from "@reduxjs/toolkit";

const initialState={
    userId:null,
    token:null,
    userName:'',
    profileData:null
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
        },
        updateProfileData(state,action)
        {
            state.profileData=action.payload
        }
    }
})
export const{updateuserId,updatetoken,updateUsername,updateProfileData}=UserSlice.actions;
export default UserSlice.reducer;
