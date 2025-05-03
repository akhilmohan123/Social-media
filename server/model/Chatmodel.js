const mongoose =require("mongoose");

const messageschema=new mongoose.Schema({
    members:{
     type:Array, 
    },
},
{
    timestamps:true
}
)
        
const Chatmodel=mongoose.model('Chat',messageschema);
module.exports=Chatmodel; 