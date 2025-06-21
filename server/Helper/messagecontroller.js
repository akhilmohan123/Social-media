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
    },
    getUserGroups:async(req)=>{
        return new Promise(async(resolve,reject)=>{
        
            let user=await getuserid(req.headers)
            if(!user)
            {
                reject("user not found")
                return;
            }
            try {
                let groups=await Group.find({
                   $or:[
                    {admin:user.userId},
                    {members:user.userId}
                   ] 
                })
                console.log(groups.length)
                //if the groups are found resolve the groups 
                if(groups.length>0)
                {
                    resolve(groups)
                }else{
                    resolve("No groups found for the user")
                }
            } catch (error) {
                reject("Error in fetching user groups "+error);
            }
        })
    },
    getAllgroups:async(req)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let user=await getuserid(req.headers)
                if(!user)
                {
                    reject("user not found")
                    return
                }else{
                    console.log("user is"+user)
                    //fetch groups that is not user part
                    let groups = await Group.find({
                        $and: [
                        { members: { $ne: user.userId } },
                        { admin: { $ne: user.userId } }
                        ]
                      })
                    if(groups)
                    {
                        console.log("groups are",groups)
                        resolve(groups)
                    }else
                    {
                        resolve("No groups found")
                    }
                }
            } catch (error) {
                reject("Error in fetching all groups:"+error)
            }
        })
    },
    joinGroup:async(req)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                let user=await getuserid(req.headers)
                if(!user)
                {
                    reject("user not found")
                    return;
                }
                let groupJoined=await Group.findOne({
                    _id:req.body.groupId
                })
                if(!groupJoined)
                {
                    reject("Group not found")
                    return;
                }
                //check if user is already a memeber of the group
                if(groupJoined.members.includes(user.userId))
                {
                    resolve("User is already a member of the group")
                    return;
                }
                //if user is not a member of the group then add the user to the group
                await groupJoined.updateOne({
                    $push:{members:user.userId}
                }).then((result)=>{
                    console.log("user joined the group successfully",result)
                    resolve(result)
                })
            } catch (error) {
                reject("Error in joining group:"+error)
            }
        })
    },
    //function to request to join the group
    requestJoinGroup:async(req)=>{
        return new Promise(async(resolve,reject)=>{
            try {
                console.log(req.headers)
                let user=await getuserid(req.headers)
                if(!user)
                {
                    reject("user not found")
                    return;

                }
                let group=await Group.findOne({
                    _id:req.body.groupId
                })
                if(!group)
                {
                    reject("Group not found")
                    return;
                }
                if(group.joinRequests.includes(user.userId))
                {
                    resolve("User has already requested to join the group")
                    return;
                }
                await group.updateOne({
                    $push:{joinRequests:user.userId}
                }).then((result)=>{
                    console.log("User has requested to join the group"+result)
                    resolve(result)

                }).catch((error)=>{
                    console.log("Error in requesting to join the group",error)
                    reject("Error in requesting to join the group:"+error)
                })
                
            } catch (error) {
                console.log("Error in request join group:",error)
                reject("Error in request join group:"+error)
            }
        })
    }

}