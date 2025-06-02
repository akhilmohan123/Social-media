import {createSlice} from "@reduxjs/toolkit";

const initialState={
    LiveStatus:false,
    liveData:[]
}

const LiveStatusSlice=createSlice({
    name:'Live',
    initialState,
    reducers:{
        updateLiveStatus(state,action){
            state.LiveStatus=action.payload;
        },
        updateLivename(state,action){
            const{id,name}=action.payload;
            const existingUser=state.liveData.filter((user)=>user.id=id)
            if(!existingUser)
            {
             state.liveData.push({id:id,name:name})
            }
        }
        

    }
})
export const{updateLiveStatus,updateLivename}=LiveStatusSlice.actions;
export default LiveStatusSlice.reducer;
