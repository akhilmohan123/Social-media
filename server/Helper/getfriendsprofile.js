const Friend = require("../model/Friendsmodel")
const Post = require("../model/postmodel")
const usermodel = require("../model/usermodel")
module.exports={
    getfriendsprofile:(id)=>{
        let friend_details={}
        let friends=[]
        let total_images=[];
        let followers;
        return new Promise(async(resolve,reject)=>{
        await usermodel.findById(id).then((res)=>{
           friend_details.Fname=res.Fname,
           friend_details.Lname=res.Lname,
           friend_details.image=res.Image
        }).catch(error=>{
           friend_details.error=true;
        })
        await Post.find({Userid:id}).then((res)=>{
            total_images=res.map(i=>i.Image)
         if(res){
            friend_details.friendpost=total_images
            friend_details.totalpost=total_images.length
         }else{
            friend_details.friendpost=''
         }
        
        }).catch(error=>{
            friend_details.error=true
        })
        await Friend.find({Userid:id}).then((res)=>{
            console.log(res)
             console.log(res.length)
            followers=res.length;
           
            friend_details.followers=followers;
        })
        resolve(friend_details)
        })
       
    },
    //function to get all users id based on the friends and return it
    getAllFriends:async (id)=>{
        return new Promise(async(resolve,reject)=>{
            try {
            await Friend.find({Userid:id}).then((res)=>{
            console.log(res)
            if(res)
            {
                res.forEach((val)=>{
                   resolve(val.Friendsid)
                })
                
            }
            }).catch(error=>reject(error))
            } catch (error) {
                consol.log(error)
                reject(error)
            }
  
        })
    }
}