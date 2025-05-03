const Friend = require("../model/Friendsmodel")
const usermodel = require("../model/usermodel")

module.exports={
    addfriend:async(req,mail)=>{
   let id;
    let response=   await usermodel.find({Email:mail})
    response.map(res=>id=res._id)
        return new Promise(async(resolve,reject)=>{
          console.log(id+"is ")
          const existingFriend = await Friend.findOne({ Userid:id, Friendsid: req });
          console.log(existingFriend)
          if (existingFriend) {
            return resolve(false); // Return false if the pair already exists
          }
          const  Friendsmodel=new Friend({
           Userid:id,
            Friendsid:req
           })
           await Friendsmodel.save().then((res)=>{
              if(res){
                resolve(true)
              }else{
                resolve(false)
              }
            })
         
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