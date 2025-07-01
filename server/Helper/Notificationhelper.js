const Fcm = require("../model/FcmModel")


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
    }
}