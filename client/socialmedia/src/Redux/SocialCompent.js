import {createSlice} from "@reduxjs/toolkit";

const initialState={
   groupComponent:false,
   handleGroupback:false,
   showCreategroup:false,
   showOwngroup:false,
   showNotification:false,
   notificationData:[]
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
        },
        updateShowNotification(state,action)
        {
            state.showNotification=action.payload;
        },
        updateNotificationdata(state,action)
        {
            state.notificationData.unshift(action.payload)
        },
        markNotificationAsRead(state,action){
            const notification=state.notificationData.find(n=>n.id ===action.payload)
            if(notification)
            {
                notification.read=true;
            }
        },
        updateNotificationStatus(state,action)
        {
            const {id,status}=action.payload;
            const notification=state.notificationData.find(n=>n.id===id)
            if(notification)
            {
                notification.status=true
            }
        },
        clearAllNotifications(state){
            state.notificationData=[]
        }
    }
});
export const{updateGroupComponent,updateGroupcomponentBack,updateShowCreategroup,updateShowOwngroup,updateShowNotification,updateNotificationdata,markNotificationAsRead,updateNotificationStatus,clearAllNotifications}=SocialComponentSlice.actions;
export default SocialComponentSlice.reducer;
