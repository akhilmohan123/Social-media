var mongoose =require('mongoose')
const userschema=new mongoose.Schema({
    Fname:{
        type:String,
    }, 
    Lname:{
        type:String,
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    authType:{
        type:String,
        enum:['google','local'],
        default:'local'
    },
    Password:{
        type:String,
        required:function(){
            return this.authType=='local'
        }
    },
    otp:{
        type:String
    },
    otpexpiry:{
        type:Date
    },
     Image:String
})

const usermodel=mongoose.model('userdetails',userschema)
module.exports=usermodel