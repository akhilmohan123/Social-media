
const Fcm = require("../model/FcmModel");
const Friend = require("../model/Friendsmodel");
const Notification = require("../model/Notification");
const {mongoose} = require("mongoose");
const ObjectId  = mongoose.Types.ObjectId;


module.exports={
    saveFcm: (data, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      
      const result = await Fcm.findOneAndUpdate(
        { Userid: id },
        { Token: data.fcmtoken },
        { new: true, upsert: true } // 👈 this avoids duplicate errors
      );

      console.log("✅ FCM token saved or updated:", result);
      resolve(true);
    } catch (error) {
      console.error("❌ Error saving/updating FCM token:", error);
      reject(false);
    }
  });
},
    getFcm:async(id)=>{
      let token
      return new Promise(async(resolve,reject)=>{
        try {
            let fcmvalue=await Fcm.find({Userid:id})
            if(fcmvalue)
            {
               token=fcmvalue[0].Token;
            }
            console.log(fcmvalue)
            console.log("Token from the fcm is ===="+token)
            resolve(token)
        } catch (error) {
          console.log("error from the fcm is ------"+error)
          reject(error);
        }
      })
    },
    saveNotification: async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log(data);

      // Check if notification with the same notificationid already exists
      const existingNotification = await Notification.findOne({ notificationid: data.notification_id });
      if (existingNotification) {
        console.log("Notification with this ID already exists. Skipping save.");
        return resolve(false); // or resolve("duplicate") if you want to distinguish the case
      }

      if (data.type === "live-stream") {
        console.log("Notification type is live-stream");
        let { notification_id, user_id, user_name, type } = data;
        let notificationData = new Notification({
          fromUser: {
            id: user_id,
            name: user_name,
          },
          type: type,
          notificationid: notification_id,
          status: "pending",
          read: false,
          seen: false
        });
        await notificationData.save();
        console.log("Notification saved successfully");
        resolve(true);
      } else if (data.type === "group-joining-request") {
        let { notification_id, user_id, user_name, type, groupId, groupname } = data;
        let notificationData = new Notification({
          fromUser: {
            id: user_id,
            name: user_name,
          },
          type: type,
          notificationid: notification_id,
          status: "pending",
          read: false,
          seen: false,
          groupId: groupId,
          groupname: groupname
        });
        await notificationData.save();
        console.log("Notification saved successfully");
        resolve(true);
      }

    } catch (error) {
      console.log("Error saving notification:", error);
      reject(false);
    }
  });
},
    getNotification:async(userid)=>{
      return new Promise(async(resolve,reject)=>{
        try {
         console.log("user id from the get notifications is "+userid)
         let friendarray=await Friend.find({Userid:userid});
         console.log("friend array is "+friendarray)
         if(friendarray && friendarray.length>0)
         {
          let friends=friendarray[0].Friendsid;
          console.log("friends from the friend array is "+friends)
          let notifications=await Notification.find({
            "fromUser.id":{$in:friends}
          })
          console.log("notifications from the database is "+notifications);
          if(notifications)
          {
            resolve(notifications);
          }
         }
        } catch (error) {
          console.log("Error getting notifications:", error);
          reject(false);
        }
      })
    },
    markNotificationAsRead:async(notification)=>{
      return new Promise(async(resolve,reject)=>{
        try{
          let result=await Notification.findByIdAndUpdate(
            { _id: notification.id },
            { status: "read" },
            { new: true }
          );
          console.log("Notification marked as read:", result);
          resolve(true);
        }catch(error){
          console.log("Error marking notification as read:", error);
          reject(false);
        }
      })
    
    },
    markNotificationAsSeen:async(notification)=>{
      console.log(notification)
      console.log("Matching with:");
console.log("fromUser.id:", notification.userId);
console.log("type:", notification.type);
      console.log(notification)
      console.log(await Notification.find({}))
      return new Promise (async(resolve,reject)=>{
        try{
          let result=await Notification.findOneAndUpdate({
           'fromUser.id': new ObjectId(notification.userId),
            type:notification.type,
            status: 'pending'
          },{
            seen:true,
            status:"ended"
          },{
            new:true  
          })
          console.log(result)
          if(result){
            console.log("Notification marked as seen:", result);
            resolve(result);
          }
        }catch(error){
          console.log("Error marking notification as seen:", error);  
          reject(false);
        }
      })
    }
}