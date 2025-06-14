const mongoose=require("mongoose")
const groupmessageschema=new mongoose.Schema({
    groupname:{type:mongoose.Schema.Types.ObjectId,ref:'Group',required:true},
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'usermodel',required:true},
    text:{type:String},
    timestamp:{type:Date,default:Date.now}
})

const Groupmessage=mongoose.model("Groupmessage",groupmessageschema);
module.exports=Groupmessage;
// This model defines the structure for messages in a group chat, including the group ID, sender ID, message text, and timestamp