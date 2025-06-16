const Group = require("../model/GroupModel");
const  Messagemodel = require("../model/Messagemodel");
const { getuserid } = require("./Getuser");


module.exports={
    addMessage:async (req,res)=>{
        const{chatId,senderId,text}=req.body;
        const Message=new Messagemodel({
            chatId,
            senderId,
            text
        })
        try {
            const result=Message.save().then(result=>{
                res.status(200).json(result)
             
            })     
        } catch (error) {
            res.status(500).json(error)
        }
    },
    getMessages:async(req,res)=>{
        
        const{chatId}=req.params;
        console.log("clicked")
        try {
            const result=await Messagemodel.find({chatId})
            res.status(200).json(result)
        } catch (error) {
            res.status(400).json(error)
        }
        
    },
    createGroup:async(header,data)=>{
        return new Promise(async(resolve,reject)=>{
            try {
               let user=await getuserid(header)  
               //if no user is there resolve false

               if(!user)
               {
                resolve(false)
               }
               console.log("group name is ",data.groupName)
               //if user is there create group
               console.log(user)
               let group=new Group({
                groupname:data.name,
                groupImage:data.image,
                admin:user.userId,
                memebers:[user.userId],
                groupDescription:data.description,
                groupType:data.type
               })
               await group.save().then((result)=>{
                console.log("Group created successfully",result)
                resolve(result)
               }).catch((error)=>{
                console.log("Error in creating group",error)
                reject(error)
               })
            } catch (error) {
                console.log("Error in createGroup:",error)
                reject(error)
            }
        })
    }
}