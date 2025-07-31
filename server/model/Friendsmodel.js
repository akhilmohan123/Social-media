const mongoose=require("mongoose")
const friendschema=new mongoose.Schema({
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true ,unique:true},
    Friendsid:[{type:mongoose.Schema.Types.ObjectId,ref:'userdetails'}]
})
const Friend=mongoose.model('Friend',friendschema)
module.exports=Friend;