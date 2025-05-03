const crypto =require("crypto")
const nodemailer=require("nodemailer")
const usermodel = require("../model/usermodel");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
module.exports={
 
    generateotp:()=>{
        return new Promise((resolve,reject)=>{
            resolve(crypto.randomInt(100000,999999).toString())
        })
    },
    sendEmail:(email,otp)=>{
        return new Promise(async(resolve,reject)=>{
            const transporter=nodemailer.createTransport({
                service:'gmail',//your email address
                auth:{
                    user:process.env.USER_EMAIL,
                    pass:process.env.USER_PASSWORD
                }
            });
            const mailOptions={
                from:process.env.USER_EMAIL,
                to:email,
                subject:'Your Photoconnect Login otp',
                text:`Your otp is :${otp}`,
                html:`<p>Your OTP is :<strong>${otp}</strong></p>`
            }
            var s=await transporter.sendMail(mailOptions)
            console.log("send mail"+s)
            if(s) resolve(true)
            else  reject(false)
        })
    },
    verifyOtp: (otp,email) => {
        return new Promise(async (resolve, reject) => {
            try {
                // Then verify the OTP for that email
                const result = await usermodel.findOne({
                    Email:email // Ensure otp is string to match your collection
                });
    
                console.log( result);
                
                if (result) {
                    let email=result.Email
                
                    console.log('OTP verification successful');
                    // Delete the OTP after successful verification
                    await usermodel.updateOne({
                        Email:email
                       },{
                        $unset:{"otp":"","otpexpiry":""}
                       })
                    resolve(result);
                } else {
                    console.log('OTP verification failed - no matching record');
                    reject(false);
                }
            } catch (error) {
                console.error('Error in verifyOtp:', error);
                reject(false);
            }
        });
    },
    addOtp:(email)=>{
        return new Promise(async(resolve,reject)=>{
            console.log(process.env.USER_EMAIL)
            var otp= await module.exports.generateotp();
            var result= await usermodel.findOne({Email:email})
            console.log(result)
            if(result!=null){
                   await usermodel.updateOne({
                    Email:email
                   },{
                    $unset:{"otp":"","otpexpiry":""}
                   }).then(async res=>{
                    console.log(1)
                    if(res){
                        console.log(2)
                        const result = await usermodel.findOne({ Email: email });
                        console.log("Found user:", result); // Should not be null
                        await usermodel.updateOne({Email:email},{$set:{otp:otp,otpexpiry:new Date()}})
                        module.exports.sendEmail(email,otp).then((res)=>{
                            console.log(res)
                            if(res){
                                resolve(true)
                            }else{
                                reject(false)
                            }
                     
                    }).catch((err)=>{
                        reject(false)
                    })
                    }else{
                        reject('email not present')
                    }
                 
                   }).catch(err=>{
                    console.log(err)
                   })

                  
            }else{
                console.log("No")
                reject("User Not Exists")
            }
           

        })
       
    },
    resetPassword: async (password, email) => {
        return new Promise(async(resolve,reject)=>{
            try {
                console.log(`Updating password for ${email}`);
                const result = await usermodel.updateOne(
                  { "Email": email },
                  { "$set": { "Password": password } }
                );
                if (result.matchedCount === 0) {
                  reject(false)
                }
                console.log("Password updated successfully:", result);
                resolve(result)
              } catch (err) {
                console.error("Error in resetPassword:", err.message);
               reject(err) // Re-throw for the caller to handle
              }
        })
       
      },
      Signup:(Fname,Lname,Email,Password,Image)=>{
        return new Promise((resolve,reject)=>{
            const User = new usermodel({
                Fname,
                Lname,
                Email,
                Password,
                Image
            });
            User.save()
            .then((rese) => {
                console.log(rese)
                resolve(rese)
            })
            .catch((err) => {
              console.log(err)  
              reject(err)
            });
          
        })
      },
      LoginVerify:(email,password)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                console.log(password)
                let useris=await usermodel.findOne({Email:email}) 
                if (!useris) {
                    reject(false)
                  }
                  console.log(useris.Email)
                
                  await bcrypt.compare(password, useris.Password).then((rese)=>{
                          if(rese){
                            console.log("response reached")
                            const token = jwt.sign({ userId: useris.Email },process.env.JWT_SECRETKEY , { expiresIn: '1h' });
                            console.log(token)
                            resolve(token)
                          }else{
                            reject(false)
                          }
                        }).catch((err)=>{
                           reject(err)
                        }) 
            }
            catch(err)
            {
                reject(err)
            }
                
        })
      }


}