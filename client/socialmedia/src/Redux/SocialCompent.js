import {createSlice} from "@reduxjs/toolkit";

const initialState={
   groupComponent:false,
   handleGroupback:false,
   showCreategroup:false,
   showOwngroup:false,
}

const SocialComponentSlice=createSlice({
    name:'Social',
    initialState,
    reducers:{
        updateGroupComponent(state,action){
            state.groupComponent=action.payload;
        },
        updateGroupcomponentBack(state,action){
            state.handleGroupback=action.payload
        },
        updateShowCreategroup(state,action){
            state.showCreategroup=action.payload;
        },
        updateShowOwngroup(state,action){
            state.showOwngroup=action.payload;
        }
        

    }
})
export const{updateGroupComponent,updateGroupcomponentBack,updateShowCreategroup,updateShowOwngroup}=SocialComponentSlice.actions;
export default SocialComponentSlice.reducer;
