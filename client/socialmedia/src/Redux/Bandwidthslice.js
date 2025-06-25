import {createSlice} from "@reduxjs/toolkit";

const initialState={
    LiveStatus:false,
    liveData:[],
    userId:null,
    streamPlay:false,
    liveVideo:false,
    
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
            const existingUser=state.liveData.find((user)=>user.id=id)
            if(!existingUser)
            {
             state.liveData.push({id:id,name:name})
            }
        },
        updateStreamplay(state,action){
            state.streamPlay=action.payload;
        },
        updateLivevideocontainer(state,action){
            state.liveVideo=action.payload;
        }
        
        

    }
})
export const{updateLiveStatus,updateLivename,updateStreamplay,updateLivevideocontainer}=LiveStatusSlice.actions;
export default LiveStatusSlice.reducer;
