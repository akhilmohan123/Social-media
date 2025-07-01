const admin=require('./firebase-admin.js')

async function sendPush(token,notificationData){
    try {
        const response=await admin.messaging().send({
            token,
            notification:{
                title:notificationData.title,
                body:notificationData.body,
                image:notificationData.image || undefined
            },
            data:notificationData.data || {}
        });
        console.log("Push sent "+response)
    } catch (error) {
        console.log("Push error",error.message);
    }
}

module.exports=sendPush