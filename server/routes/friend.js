var express=require("express");
const {getfriendsprofile} = require("../Helper/getfriendsprofile");
var router=express.Router()

router.get("/view-friend-profile/:id",(req,res)=>{
let id=req.params.id;
getfriendsprofile(id).then(data=>{
   if(data){
    res.status(200).json({data})
   }else{
    res.status(400).json({message:"error"})
   }
}).catch(error=>{
    res.status(400).json({error})
})
})

module.exports=router