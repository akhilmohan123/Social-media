
//model for group 
const mongoose=require('mongoose');
const groupschema=new mongoose.Schema({
    groupname:{type:String,required:true},
    memebers:[{type:mongoose.Schema.Types.ObjectId,ref:'usermodel'}],
    groupImage:{type:Object},
    admin:{type:mongoose.Schema.Types.ObjectId,ref:'usermodel',required:true},
    groupDescription:{type:String},
    groupType:{type:String}, // public or private
    timestamp:{type:Date,default:Date.now}
})

const Group=mongoose.model("Group",groupschema);
module.exports=Group;
