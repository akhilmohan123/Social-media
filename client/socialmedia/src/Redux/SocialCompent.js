import {createSlice} from "@reduxjs/toolkit";

const initialState={
   groupComponent:false,
   handleGroupback:false,
   showCreategroup:false,
   showOwngroup:false,
   showNotification:false,
   notificationData:[],
   latestActivity:[],
   status:false,
   groupchat:false,
   group:{}
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
updateNotificationdata(state, action) {
  console.log("Updating notification data:", action.payload); // Log here
  const exists = state.notificationData.some(
    (n) => n.notificationid === action.payload.notificationid
  );

  if (!exists) {
    state.notificationData.unshift(action.payload);
  }
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
        },
        removeNotification(state, action) {
              console.log("Removing notification ID:", action.payload);
              console.log("Current notifications:", state.notificationData);
               state.notificationData = state.notificationData.filter(
             n => n.id !== action.payload
         );
        },
        updateLatestActivity(state,action){
            state.latestActivity = action.payload;
        },
        updateSetstatus(state,action)
        {
            state.status=action.payload
        },
        updateGroupchatStatus(state,action)
        {
            state.groupchat=action.payload
        },
        updateSelectedGroup(state,action){
            state.group=action.payload
        }
    }
});
export const{updateGroupComponent,updateGroupcomponentBack,updateShowCreategroup,updateShowOwngroup,updateShowNotification,updateNotificationdata,markNotificationAsRead,updateNotificationStatus,clearAllNotifications,removeNotification,updateLatestActivity,updateSetstatus,updateGroupchatStatus,updateSelectedGroup}=SocialComponentSlice.actions;
export default SocialComponentSlice.reducer;
