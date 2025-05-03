
const Chatmodel=require("../model/Chatmodel");
const usermodel = require("../model/usermodel");
const { getuserid } = require("./Getuser");
module.exports={
    createChat:async(req,res)=>{
    const newchat=new Chatmodel({
        members:[req.body.senderId,req.body.recieverId]
    })
    console.log(newchat)
    try {
        const result=await newchat.save();
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json(error)
    }
},
   userChats:async(req,res)=>{
     
    try {
        getuserid(req.headers).then(async(result)=>{
            let mail=result.userId
            let userid;
            let id;
         const data= await usermodel.find({Email:mail})
           data.map(data=>id=data._id) 
           userid=id.toString()
           let friendid=req.params.friendid;
        const chat=await Chatmodel.find({
            members:{$all:[userid,friendid]}
        })
        console.log(chat)
        res.status(200).json({chat,userid})
    })
    
    } catch (error) {
        res.status(400).json(error)
    }
},
    findChat:async (req,res)=>{
    try {
         const chat=await Chatmodel.findOne({
            members:{$all:[req.params.firstId,req.params.secondId]}

         })
         res.status(200).json(chat)
    } catch (error) {
        res.status(400).json(error)
    }
}
}