
const Chatmodel=require("../model/Chatmodel");
const Friend = require("../model/Friendsmodel");
const usermodel = require("../model/usermodel");
const { getuserid } = require("./Getuser");
module.exports={
    createChat:async(req,res)=>{
        console.log("create chat is called")
        console.log(req.body.senderId)
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
            let id=result.userId
            let userid;
         const data= await usermodel.findById(id) 
           let friendid=req.params.friendid;
        const chat=await Chatmodel.find({
            members:{$all:[id,friendid]}
        })
        //console.log(chat)
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
},
fetchActiveusers:(data)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            console.log("inside the fetch members")
           let result= await Friend.find({Userid:data},{Friendsid:1,_id:0})
           console.log(result)
           let friend=result[0].Friendsid || []
           console.log("id is ===="+friend)
           let d=await usermodel.find({_id:data})
        //    console.log(d)   
           const friendDetails=await Promise.all(
            friend.map(async(id)=>{
                const user = await usermodel.findById(id).select("Fname");
                 if (user) {
                         return { name: user.Fname, userid: user._id };
                            }
                return null; // skip if not found
            })
           )
           console.log(friendDetails)
           resolve(friendDetails)
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
}
}