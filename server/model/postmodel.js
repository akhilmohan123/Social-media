const mongoose=require('mongoose');


const commentSchema=new mongoose.Schema({
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true },
    Username:String,
    Text:{type:String,required:true},
    createdAt:{type:Date,default:Date.now}
})

const Postschema=new mongoose.Schema({
    Username:String,
    Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'userdetails', required: true },
    Image:Object,
    Description:String,
    Location:String,
    Like: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userdetails' }],
    Comment: [commentSchema],
    isLiked:{type:Boolean,default:false}
},{timestamps:true})
const Post=mongoose.model('Post',Postschema);
module.exports=Post;