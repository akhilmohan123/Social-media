var mongoose =require('mongoose')
const userschema=new mongoose.Schema({
    Fname:{
        type:String,
        required:true
    }, 
    Lname:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
     Image:Object
})

const usermodel=mongoose.model('userdetails',userschema)
module.exports=usermodel