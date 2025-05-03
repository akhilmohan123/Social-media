const { Schema } = require("mongoose");
const Post = require("../model/postmodel");
const usermodel = require("../model/usermodel")
module.exports={
      addpost:(content,image,name)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(name+"ss iss")
            let id=name.userId    
            const user=await usermodel.findOne({Email:id})
            const username=user.Fname;
            const userid=user._id
            const postmodel=new Post({
                Username:username,
                Userid:userid,
                Image:image,
                Description:content,
                Like:0
            })
            postmodel.save().then((res)=>{
               resolve(res)
            })
        })
      },
      addlike:(like,postid)=>{
        return new Promise(async(resolve,reject)=>{
       let res=  await Post.findByIdAndUpdate(postid,{$inc:{Like:1}})
       if(res){
        resolve(true)
       }else{
        resolve(false)
       }
        })
      },
      removelike:(like,postid)=>{
        return new Promise(async(resolve,reject)=>{
            let res=await Post.findByIdAndUpdate(postid,{$inc:{Like:-1}})
            if(res){
                resolve(true)
            }else{
                resolve(false)
            }
        })
      }
}