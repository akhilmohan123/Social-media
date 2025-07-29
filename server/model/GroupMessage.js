
const mongoose=require("mongoose")
const groupmessageschema=new mongoose.Schema({
    groupname: { type: String, required: true },
    groupID: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'userdetails'},
    text:{type:String},
    timestamp:{type:Date,default:Date.now}
})
const GroupMessage=mongoose.model('GroupMessage',groupmessageschema)
module.exports=GroupMessage;