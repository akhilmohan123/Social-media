const mongoose=require("mongoose")

const messageschema=new mongoose.Schema({
    chatId:{
        type:String,
    },
    senderId:{
        type:String
    },
    text:{
        type:String,
    },
},
    {
        timestamps:true
    }
);
const Messagemodel=mongoose.model("Message",messageschema)
module.exports=Messagemodel