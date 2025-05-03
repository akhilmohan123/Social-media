const mongoose=require("mongoose")
const friendschema=new mongoose.Schema({
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'usermodel', required: true },
    Friendsid:Object
})
const Friend=mongoose.model('Friend',friendschema)
module.exports=Friend;