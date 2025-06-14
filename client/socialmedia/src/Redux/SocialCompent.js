import {createSlice} from "@reduxjs/toolkit";

const initialState={
   groupComponent:false,
   handleGroupback:false,
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
        }
        

    }
})
export const{updateGroupComponent,updateGroupcomponentBack}=SocialComponentSlice.actions;
export default SocialComponentSlice.reducer;
