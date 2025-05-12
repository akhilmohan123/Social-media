const mongoose=require('mongoose');

const Postschema=new mongoose.Schema({
    Username:String,
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'usermodel', required: true },
    Image:Object,
    Description:String,
    Location:String,
    Like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'usermodel' }]
},{timestamps:true})
const Post=mongoose.model('Post',Postschema);
module.exports=Post;