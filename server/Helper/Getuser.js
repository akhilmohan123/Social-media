const jwt = require('jsonwebtoken');
const usermodel = require('../model/usermodel');
const Post = require("../model/postmodel");
require('dotenv').config();
const fs=require("fs");
module.exports = {
  getuserid: (data) => {
    //console.log(data)
    return new Promise((resolve, reject) => {
      const { authorization } = data;
      if (!authorization) {
        return resolve(false);
      }
      const token = authorization.replace("Bearer ", "");
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
  
  getpeople: (authorization) => {
  //console.log("get people called");
  return new Promise(async (resolve, reject) => {
    let res = {};
    try {
      if (!authorization) {
        res.status = false;
        return resolve(res);
      }

      const token = authorization.replace("Bearer ", "");

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
  posteditdata:(email,Fname,Lname,Image)=>{
    
    return new Promise(async(resolve,reject)=>{
      try {
        if(Image){
          var filepath=Image.path
        var img = fs.readFileSync(filepath);
        var encode_image = img.toString('base64');
        
        var finalImg = {
            contentType: Image.mimetype,
            image: Buffer.from(encode_image, 'base64')
        };
        //console.log(finalImg)
        await usermodel.findOne({Email:email}).then(async(result)=>{
          //console.log(result)
        let id=result._id
        //console.log(id)
        await usermodel.findByIdAndUpdate(id,{
          Fname:Fname,
          Lname:Lname,
          Image:finalImg
        }).then(result=>{
          //console.log(result)
          resolve({data:true})
        }).catch(err=>resolve({data:false}))
        }).catch(err=>resolve({data:false}))
        }else{
          await usermodel.findOne({Email:email}).then(async(result)=>{
          let id=result._id
          //console.log(id)
          await usermodel.findByIdAndUpdate(id,{
            Fname:Fname,
            Lname:Lname,
            
          }).then(result=>{
            //console.log(result)
            resolve({data:true})
          }).catch(err=>resolve({data:false}))
          }).catch(err=>resolve({data:false}))
        }
       
      } catch (error) {
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
