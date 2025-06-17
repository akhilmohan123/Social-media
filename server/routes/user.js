var express=require('express')
const usermodel = require('../model/usermodel')
var router=express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const upload = multer({ dest: "uploads/",limits: { fileSize: 50 * 1024 * 1024 } });
const fs=require('file-system');
const { getuserid, getusername, getpeople, geteditdata, posteditdata, getuserpost } = require('../Helper/Getuser');
const { addpost, addlike, removelike, uploadpost } = require('../Helper/Poststore');
const { addfriend, removefriend } = require('../Helper/Addfriends');
const Friend = require('../model/Friendsmodel');
const Post = require('../model/postmodel');
const {getfriendsprofile, getAllFriends, getFriendName} = require('../Helper/getfriendsprofile');
const { Googleauth, googleAuthMiddleWare } = require('../Helper/Authentication');
const { addOtp, verifyOtp, resetPassword, Login, Signup, LoginVerify } = require('../Helper/UserAuthentication');
const { createGroup } = require('../Helper/messagecontroller');
 require('dotenv').config()
 const verifyToken = async(req, res, next) => {
  const tokennew = req.header('Authorization');
   const token = tokennew.split(' ')[1]
  console.log(token)
  if (!token) {
      return res.status(401).send('Access denied. No token provided.');
  }
  try { 
      
      const decoded = jwt.verify(token,process.env.JWT_SECRETKEY );
      req.user = decoded;
      next();
  } catch (error) {
      res.status(400).send('Invalid token.');
  }
};
router.get('/',(req,res)=>{
    console.log("This is req body")
})
router.post('/signup', upload.single('file'), async (req, res) => {
  console.log("hitted signup")
  if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
  }

  let filePath = req.file.path;
  var img = fs.readFileSync(filePath);
  var encode_image = img.toString('base64');
  var finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, 'base64')
  };

  const { fname, lname, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);

 await Signup(fname,lname,email,hashedPassword,finalImg).then((data)=>{
  if(data){
    res.status(200).json(data);
  }
 }).catch((err)=>{
  if(err){
    res.status(400).json({ message: 'Server error', err });
  }
 })
});

router.post('/login',async(req,res)=>{
    console.log("hitted the login page")
    const{email,password}=req.body;
    
    await LoginVerify(email,password).then(result=>{
      if(result){
        res.status(200).json( result);
      }
    }).catch(err=>{
      res.status(400).json(err)
    })
    
         
})
router.get("/test",(req,res)=>{
   const {authorization}= req.headers;
  if(!authorization){
   return res.status(400).json({message:"YOu mus logged in"})
  }
  const token=authorization.replace("Bearer ","");
  jwt.verify(token,process.env.JWT_SECRETKEY,async (err,payload)=>{
    if(err){
      return res.status(400).json({message:"Error occured",err})
    }
  })
})
router.post("/post",upload.single("file"),(req,res)=>{
  try {
     getuserid(req.headers).then((resn)=>{
  const {content}=req.body
  let files=req.file.path;
  var img = fs.readFileSync(files);
  var encode_image = img.toString('base64');
  var finalImg = {
      contentType: req.file.mimetype,
      image: Buffer.from(encode_image, 'base64')
  };
  addpost(content,finalImg,resn).then(result=>{
    if(result){
      res.status(200).json({data:true})
    }
  }).catch(err=>{
    res.status(400).json({data:false})
  })
})
  } catch (error) {
    console.log(error)
  }

})
router.get("/profile",(req,res)=>{
  console.log("profile page called")
 getuserid(req.headers).then(async(response)=>{

  let mail=response.userId;
  if(response){
    await usermodel.findOne({Email:mail}).then(result=>{
     let id=result._id;
    
       getfriendsprofile(id).then(data=>{
       if(data){
        res.status(200).json({data})
       }
       }).catch(err=>{
        res.status(400).json({message:"Error"})
       })
     
    }).catch(err=>res.status(400).json({message:"Error"}))
 }
})
})
router.get("/friends",async(req,res)=>{

  const {authorization}=req.headers
  console.log(authorization)
  await getpeople(authorization).then((response)=>{
  if(response){
    
    res.status(200).json(response);
  }else{
    res.status(400).json({message:"There is no user"})
  }
 })
})
router.post("/add-friend/:key",async(req,res)=>{
  let id=req.params.key
  console.log(id)
  getuserid(req.headers).then((rese)=>{
    addfriend(req.params.key,rese.userId).then((result)=>{
      if(result){
      
       res.status(200).json(true)
      }else{
        res.status(400).json(false);
      }
    })
  })

})
router.get('/get-post', async (req, res) => {
  try {
    
    const resee = await getuserid(req.headers);
   
    if (!resee) {
      return res.status(400).json({ message: "Invalid token or no token provided" });
    }

    const email = resee.userId;
    const user = await usermodel.findOne({ Email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const id = user._id;
    const friends = await Friend.find({});
    const userFriends = friends.filter(data => data.Userid.equals(id));
    const friendsIds = userFriends.map(data => data.Friendsid);
    const posts = await Post.find({ Userid: { $in: friendsIds } });
    
    if (posts.length > 0) {
      res.status(200).json(posts);
    } else {
      res.status(404).json({ message: "No posts found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
router.post("/add-like/:id",(req,res)=>{
  let postid=req.params.id
  let likes=req.body;
  let resulted={};
  getuserid(req.headers).then((result)=>{
  usermodel.findOne({Email:result.userId}).then(data=>{
    let id=data._id;
    addlike(likes,postid).then(result=>{
      console.log(result)
      resulted.valid=result
      resulted.id=id
      console.log(resulted)
      if(result){
        res.status(200).json(resulted)
      }else{
        res.status(400).json({result})
      }
    })
  })
  })
})
router.post(`/remove-like/:id`,(req,res)=>{
  let postid=req.params.id
  let likes=req.body;
  let resulted={};
  getuserid(req.headers).then((result)=>{
    usermodel.findOne({Email:result.userId}).then((resp)=>{
      let id=res._id;
      removelike(likes,postid).then((results)=>{
        resulted.valid=results
        resulted.id=id
        console.log(resulted)
        if(results){
          res.status(200).json(resulted)
        }else{
          res.status(400).json({resulted})
        }
      })
    })
  })
})
router.post(`/remove-friend/:id`,(req,res)=>{
  let id=req.params.id
  getuserid(req.headers).then((rese)=>{
    removefriend(id,rese.userId).then((result)=>{
      if(result.acknowledged){
       res.status(200).json(result)
      }else{
        res.status(400).json(result);
      }
    })
  })
})
router.get(`/get-friend/:id`,async(req,res)=>{
  try {
    const id=req.params.id;
    const details=await usermodel.findById(id)
    res.status(200).json(details)
  } catch (error) {
    res.status(400).json(error)
  }   
})
router.get('/user/search',async (req,res)=>{
  console.log("search")
  const query = req.query.query;
  try {
    const results = await usermodel.find({
      $or: [
        { Fname: { $regex: query, $options: 'i' } },
        { Lname: { $regex: query, $options: 'i' } },
        { Email: { $regex: query, $options: 'i' } }
      ]
    });
 console.log(results)
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).send('Server Error');
  }
})
router.get("/edit-profile",(req,res)=>{
 getuserid(req.headers).then(result=>{
  geteditdata(result.userId).then(data=>{
    res.status(200).json(data)
  }).catch(error=>{
    res.status(400).json(error)
  })
 })
})
router.post("/edit-profile",upload.single("file"),(req,res)=>{
 const{Fname,Lname}=req.body
let Image=req.file
 console.log(Image)
  getuserid(req.headers).then(result=>{
    posteditdata(result.userId,Fname,Lname,Image).then(result=>{
      res.status(200).json(result)
    }).catch(err=>{
      res.status(400).json(err)
    })
  })
})
router.get("/user-post",(req,res)=>{
  getuserid(req.headers).then((result)=>{
    
    getuserpost(result.userId).then(response=>{
      res.status(200).json(response)
    }).catch(er=>{res.status(400).json(er)})
  }).catch(err=>{res.status(400).json(err)})
})
router.delete("/delete-post/:id",async(req,res)=>{
  try {
    let id=req.params.id
    await Post.findByIdAndDelete(id).then(result=>{
      res.status(200).json(result)
    })
  } catch (error) {
    res.status(400).json(error)
  }
})
router.get("/google/authenticate",googleAuthMiddleWare.authenticate(),(req,res)=>{
  console.log("Called")
})
router.get("/auth/google/callback",googleAuthMiddleWare.callback(),(req,res)=>{
  console.log(req.user)
   let userId=req.user._id
   const token = jwt.sign({ userId: userId },process.env.JWT_SECRETKEY , { expiresIn: '1h' });
   console.log(token)
  // console.log(token)
  res.redirect(`http://localhost:5173/social?token=${token}&id=${userId}`);
})
router.post("/auth/send-reset-code",async(req,res)=>{
  console.log("get otp called")
 await addOtp(req.body.email).then((result)=>{
    if(res){
     res.status(200).json(result)
    }else{
      res.status(401).json("Otp was not Send")
    }
  }).catch(err=>{
    console.log(err)
    res.status(401).json(err)
  })
})
router.post("/auth/verify-reset-code",async(req,res)=>{
  console.log("verify otp was called")
  const otp=req.body.code
  const email=req.body.email
  await verifyOtp(otp,email).then((result)=>{
    res.status(200).json(true)
  }).catch(err=>{
    res.status(401).json(err)
  })
})
router.post("/auth/reset-password",async(req,res)=>{
  console.log("reset password api called")
  let password=req.body.newPassword
  const hashedPassword = await bcrypt.hash(password, 8);
  let email=req.body.email
  await resetPassword(hashedPassword,email).then((result)=>{
    if(result.acknowledged ==true){
      res.status(200).json(result)
    }
  }).catch(err=>{
    res.status(400).json(false)
  })
})


//add post image,caption,location router
router.post("/social/upload",upload.single("file"),async(req,res)=>{
  try {
    let userresult=await getuserid(req.headers)
    let email=userresult.userId;
    let user=await usermodel.findOne({Email:email})
    let id=user._id
  console.log(req.body)
  console.log(req.file)
  let file=req.file;
  let caption=req.body.caption
  let location=req.body.location
  await uploadpost(id,file,caption,location).then((result)=>{
    console.log(result)
    if(result){
      res.status(200).json(result)
    }
  }).catch(err=>{
    console.log(err)
    res.status(400).json(err)
  })
}
catch(err){
  console.log(err)
  res.status(400).json(err)
}
}
)


//get friends list for socket server

router.get("/api/get-friends/:id",async(req,res)=>{
  try{
    console.log("Called the api")
    const id=req.params.id
    await getAllFriends(id).then((result)=>{
      console.log(result)
      if(result)
      {
        res.status(200).json(result)
      }
    }).catch(err=>{
      console.log(err)
      res.status(400).json(err)
    })
  }catch(err)
  {
    console.log(err)
    res.status(400).json(err)
  }
})

//router to get username based on the id
router.get("/api/get-friendname/:id",async(req,res)=>{
  try {
    console.log("called get friendname api=========")
    let userid=req.params.id
    console.log(userid)
    await getFriendName(userid).then((response)=>{
      if(response)
      {
        console.log(response)
        return res.status(200).json(response)
      }
    }).catch((err)=>{
      return res.status(404).json(response)
    })
  } catch (error) {
    return res.status(404).json(error)
  }
})

//router to create a group
router.post("/group/create",upload.single("image"),async(req,res)=>{
  try {
    let header=req.headers;
    let groupData={
      name:req.body.name,
      description:req.body.description,
      type:req.body.type,
      image:req.file ? req.file.path : null
    }
    console.log(groupData)
    await createGroup(header,groupData).then((result)=>{
      if(result)
      {
        console.log("Group created successfully",result._id)
        res.status(200).json(result._id);

      }else{
        res.status(400).json({message:"Failed to create group"})
      }
    }).catch((error)=>{
      console.log("Error in creating group",error)
      res.status(400).json({message:"Error in creating group",error})
    })
    
  } catch (error) {
    res.status(400).json({message:"Error while creating group",error})
    console.log("Error while creating group",error);
  }
})
module.exports=router;
/*"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJha2hpbCIsImlhdCI6MTcyMDIwMDc4MCwiZXhwIjoxNzIwMjA0MzgwfQ.5ZZmIz4SxIqWv3UCDBGN39cCbjBRNdGNimq1e6RY31w"*/