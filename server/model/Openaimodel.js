const mongoose=require("mongoose")

const openaischema=new mongoose.Schema({
     text:String,
     reply:String
})
const Aimodel=mongoose.model('Aimodel',openaischema)
module.exports=Aimodel