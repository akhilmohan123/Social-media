const Friend = require("../model/Friendsmodel")
const usermodel = require("../model/usermodel")

module.exports={
    addfriend:async(friendid,id)=>{
        return new Promise(async(resolve,reject)=>{
          //console.log(id+"is ")
          const userFrienddoc = await Friend.findOne({ Userid:id});
          //console.log(userFrienddoc)
          if (userFrienddoc) {
            if( userFrienddoc.Friendsid.includes(friendid))
            {
               //console.log("friendid includes in the document")
              return resolve(false); // Return false if the pair already exists
            }
            //if user exist but not friend of that user
            userFrienddoc.Friendsid.push(friendid);
            userFrienddoc.save()
            return resolve(true)
             }else{ // in case of new user and new friend
             const  Friendsmodel=new Friend({
               Userid:id,
               Friendsid:friendid
           })
           await Friendsmodel.save().then((res)=>{
              if(res){
                resolve(true)
              }else{
                resolve(false)
              }
            })
            }
         
         
        })
       
    },
    removefriend:async(req,mail)=>{
      let id;
       let response=   await usermodel.find({Email:mail})
      
       response.map(res=>id=res._id)
           return new Promise(async(resolve,reject)=>{
             const existingFriend = await Friend.deleteOne({ Userid:id, Friendsid: req });
            resolve(existingFriend)
           })
          
       },
    
}