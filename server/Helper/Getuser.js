const jwt = require('jsonwebtoken');
const usermodel = require('../model/usermodel');
const Post = require("../model/postmodel");
require('dotenv').config();
const fs=require("fs");
const { mongoose } = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;
module.exports = {
  getuserid: (token) => {
    //console.log(data)
    return new Promise((resolve, reject) => {
      if (!token) {
        return resolve(false);
      }
      jwt.verify(token, process.env.JWT_SECRETKEY, (err, payload) => {
        if (err) {
          return resolve(false);
        }
        resolve(payload);
      });
    });
  },
  
  getusername: (mail) => {
    return new Promise(async (resolve, reject) => {
      try {
        let response = await usermodel.findOne({ Email: mail.userId });
        if (response) {
          let user = response.Fname + ' ' + response.Lname;
          let userdetails = {
            name: user,
            Image: response.Image
          };
          resolve(userdetails);
        } else {
          reject("User not found");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  
  getpeople: (token) => {
  //console.log("get people called");
  return new Promise(async (resolve, reject) => {
    let res = {};
    try {
      if (!token) {
        res.status = false;
        return resolve(res);
      }

      jwt.verify(token, process.env.JWT_SECRETKEY, async (err, payload) => {
        if (err) {
          res.status = false;
          return resolve(res);
        }

        try {
          const useris = payload;
          const user = await usermodel.findOne({ _id: useris.userId }); // ✅ FIXED

          if (user) {
            res.id = user._id;

            const users = await usermodel.find({}).select("-Password").exec();

            if (users) {
              const authorizedUsers = users.filter(
                u => u._id.toString() !== user._id.toString()
              );
              res.authorizedUsers = authorizedUsers;
              res.status = true;
              return resolve(res);
            } else {
              res.status = false;
              return resolve(res);
            }
          } else {
            res.status = false;
            return resolve(res);
          }
        } catch (error) {
          console.error("Inner try-catch error:", error);
          res.status = false;
          return resolve(res);
        }
      });
    } catch (error) {
      console.error("Outer try-catch error:", error);
      res.status = false;
      return resolve(res);
    }
  });
}
,
  geteditdata:async(userid)=>{
    return new Promise(async(resolve,reject)=>{
      let userdata={}
      try {
        await usermodel.findOne({Email:userid}).then((result)=>{
          userdata.Fname=result.Fname
          userdata.Lname=result.Lname
          userdata.Image=result.Image
        })
        resolve(userdata)
      } catch (error) {
        resolve({data:false})
      }
    })
  },
  posteditdata:(id,Fname,Lname,Image)=>{
    
    return new Promise(async(resolve,reject)=>{
      try {
        //initialize filter obj to store the values that is not undefined
        let filteredObj={}
        if(id!=undefined)
        {
          if(Fname!=undefined) filteredObj.Fname=Fname
          if(Lname!=undefined) filteredObj.Lname=Lname
          if(Image!=undefined) filteredObj.Image=Image

          console.log(filteredObj)
          console.log(id)
        //console.log(id)
        await usermodel.findByIdAndUpdate(id,
          { $set: filteredObj }, { new: true }
        ).then(result=>{
          console.log(result)
          resolve({data:true})
        }).catch(err=>resolve({data:false}))
      }
      } catch (error) {
        console.log(error)
        resolve({data:false})
      }
      
    })
  },
  getuserpost:(email)=>{
    return new Promise(async(resolve,reject)=>{
      try {
        await usermodel.findOne({Email:email}).then(async(res)=>{
          let id=res._id
          await Post.find({Userid:id}).then(res=>{
           if(res){
            resolve(res)
           }
          }).catch(err=>reject(err))
        }).catch(err=>reject(err))
      } catch (error) {
        reject(error)
      }
    })
  },
  getName:(req)=>{
    return new Promise(async(resolve,reject)=>{
      try {
        console.time("token-decode");
        let user=await module.exports.getuserid(req.headers)
        let Id=user.userId
        let userDetails=await usermodel.findById(Id)
        let Name=userDetails.Fname + userDetails.Lname
        if(Name)
        {
          resolve(Name)
        }
      } catch (error) {
        //console.log(error)
        reject(error)
      }
    })
  }
};
