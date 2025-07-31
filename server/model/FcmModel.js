const mongoose=require("mongoose")
const FcmModel=new mongoose.Schema({
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true ,unique:true},
    Token:{type:String}
})
const Fcm=mongoose.model('FCM',FcmModel)
module.exports=Fcm;