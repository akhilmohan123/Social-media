var express=require('express')
const usermodel = require('../model/usermodel')
var router=express.Router()
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer')
const fs=require('file-system');
const { getuserid, getusername, getpeople, geteditdata, posteditdata, getuserpost,getName } = require('../Helper/Getuser');
const { addpost, addlike, removelike, uploadpost, showPost, toggleLike } = require('../Helper/Poststore');
const { addfriend, removefriend } = require('../Helper/Addfriends');
const Friend = require('../model/Friendsmodel');
const Post = require('../model/postmodel');
const {getfriendsprofile, getAllFriends, getFriendName} = require('../Helper/getfriendsprofile');
const { Googleauth, googleAuthMiddleWare } = require('../Helper/Authentication');
const { addOtp, verifyOtp, resetPassword, Login, Signup, LoginVerify } = require('../Helper/UserAuthentication');
const { createGroup, getUserGroups, getAllgroups, joinGroup, requestJoinGroup, getGroupname, Acceptgroupjoin,Rejectgroupjoin, groupStatus, saveGroupMessage, fetchGroupmessage, fetchGroupmembers } = require('../Helper/messagecontroller');
const { saveFcm, getFcm, saveNotification, getNotification, markNotificationAsSeen, markNotificationAsRead } = require('../Helper/Notificationhelper');
const Getuser = require('../Helper/Getuser');
const { fetchActiveusers } = require('../Helper/Chatcontroller');
const { mongoose } = require('mongoose');
const ObjectId  = mongoose.Types.ObjectId;
const { v4: uuidv4 } = require("uuid");
const path=require("path")
 require('dotenv').config()
//function to get the filename



//  const upload = multer({
//    dest: "uploads/",limits: { fileSize: 50 * 1024 * 1024 } }
//   );

const storage=multer.diskStorage({
  destination:function(req,file,cb)
  {
    if(file.fieldname=='profilePic')
    {
      cb(null,'uploads/profilePics');
    }else{
      cb(null,'uploads/posts');
    }
    
  },
  filename:function(req,file,cb)
  {
    const uuid=uuidv4()
    const date=new Date();
    const month=date.getMonth()+1;
    const year=date.getFullYear();
     cb(null, `${year}_${month}_${date.getDate()}_${uuid}${path.extname(file.originalname)}`);
  }
})
const upload=multer({
  storage:storage,
  limits:{fileSize:50*1024*1024}
})
 const verifyToken = async(req, res, next) => {
  const tokennew = req.header('Authorization');
   const token = tokennew.split(' ')[1]
  ////console.log(token)
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
    ////console.log("This is req body")
})
router.post('/signup', upload.fields([
  {name:'profilePic',maxCount:1},


]), async (req, res) => {
  ////console.log("hitted signup")
 if (!req.files || !req.files['profilePic'] || req.files['profilePic'].length === 0) {
  return res.status(400).json({ message: 'No profile picture uploaded' });
}

      const profilePicFile = req.files['profilePic'] ? req.files['profilePic'][0] : null;
    let profilepicname = profilePicFile ? profilePicFile.filename : null;
    console.log("Profile pic name is "+profilepicname)

  // let filePath = req.file.path;
  // var img = fs.readFileSync(filePath);
  // var encode_image = img.toString('base64');
  // var finalImg = {
  //     contentType: req.file.mimetype,
  //     image: Buffer.from(encode_image, 'base64')
  // };
  let finalImg=profilepicname
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
    ////console.log("hitted the login page")
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
  console.log("add post called")
  try {
    let files;
     getuserid(req.headers).then((resn)=>{
  const {content}=req.body
  if(req.file.path!=undefined)
  {
     files=req.file.path;
  }
  
  // var img = fs.readFileSync(files);
  // var encode_image = img.toString('base64');
  // var finalImg = {
  //     contentType: req.file.mimetype,
  //     image: Buffer.from(encode_image, 'base64')
  // };
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
  //console.log("profile page called")
 getuserid(req.headers).then(async(response)=>{

  let id=response.userId;
  if(response){
    await usermodel.findById(new ObjectId(id)).then(result=>{
    
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
  //console.log(authorization)
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
  //console.log(id)
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
  console.log("get post is called =======")
  try {
    let user=await getuserid(req.headers);
    let data=await showPost(user.userId)
    if(data.length>0)
    {
      res.status(200).json(data)
    }else
    {
      res.status(200).json([])
      
    }

  } catch (error) {
    console.log("Error in feteching the post"+error);
    res.status(400).json({message:"Something went wrong please try again later"})
  }
  // try {
    
  //   const resee = await getuserid(req.headers);
   
  //   if (!resee) {
  //     return res.status(400).json({ message: "Invalid token or no token provided" });
  //   }

  //   const Id = resee.userId;
  //   console.log("id from the get post is =======" + Id);
  //   const user = await usermodel.findById(new ObjectId(Id));

  //   if (!user) {
  //     return res.status(404).json({ message: "User not found" });
  //   }

  //   const friend = await Friend.find({});
  //   const userFriends = friend.filter(data => data.Userid.equals(Id));
  //   console.log("after the user friends ")
  //   console.log(userFriends)
  //   const friends = userFriends.map(data => data.Friendsid,{ Friendsid: 1, _id: 0 });
  //   console.log("after the friends ids")
  //   let username=await getFriendName(Id);
  //   //  const friendsIds = friends.flatMap(f => f.Friendsid);
  //   //  console.log("before the posts is ======")
  //   //  console.log(friendsIds)
  //   let postdata={}
  //   const posts = await Post.find({ Userid: { $in: friends[0] } });
  //   postdata.name=username;
  //   postdata.posts=posts;
  //   console.log(postdata)
  //   console.log("after the post")
  //   console.log(posts)
    
  //   if (posts.length > 0) {
  //     res.status(200).json(postdata);
  //   } else {
  //     res.status(404).json({ message: "No posts found" });
  //   }
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: error.message });
  // }
});
router.post("/add-like/:id",(req,res)=>{
  let postid=req.params.id
  let resulted={};
  getuserid(req.headers).then((result)=>{
    console.log("userid from the add like is "+result.userId)
    toggleLike(result.userId,postid).then(result=>{
      console.log(result)
      // resulted.valid=result
      // resulted.id=id
      //console.log(resulted)
      if(result){
        res.status(200).json(result)
      }else{
        res.status(400).json({result})
      }
    })
  })
  })
router.post(`/remove-like/:id`,(req,res)=>{
  let postid=req.params.id
  getuserid(req.headers).then((result)=>{
      removelike(result.userId,postid).then((results)=>{
        //console.log(resulted)
        if(results){
          res.status(200).json(resulted)
        }else{
          res.status(400).json({resulted})
        }
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
  //console.log("search")
  const query = req.query.query;
  try {
    const results = await usermodel.find({
      $or: [
        { Fname: { $regex: query, $options: 'i' } },
        { Lname: { $regex: query, $options: 'i' } },
        { Email: { $regex: query, $options: 'i' } }
      ]
    });
 //console.log(results)
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
router.post("/edit-profile",upload.fields([
  {name:'profilePic',maxCount:1},
]),(req,res)=>{
 const{Fname,Lname}=req.body
 console.log(Fname)
 console.log(Lname)
 const ediprofilePicFile = req.files['profilePic'] ? req.files['profilePic'][0] : null;
 let editprofilepicname = ediprofilePicFile ? ediprofilePicFile.filename : null;
 console.log("Profile pic name is from the editprofile  "+editprofilepicname)
 //console.log(Image)
  getuserid(req.headers).then(result=>{
    posteditdata(result.userId,Fname,Lname,editprofilepicname).then(result=>{
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
  //console.log("Called")
})
router.get("/auth/google/callback",googleAuthMiddleWare.callback(),(req,res)=>{
  //console.log(req.user)
   let userId=req.user._id
   const token = jwt.sign({ userId: userId },process.env.JWT_SECRETKEY , { expiresIn: '1h' });
   //console.log(token)
  // //console.log(token)
  res.redirect(`http://localhost:5173/social?token=${token}&id=${userId}`);
})
router.post("/auth/send-reset-code",async(req,res)=>{
  //console.log("get otp called")
 await addOtp(req.body.email).then((result)=>{
    if(res){
     res.status(200).json(result)
    }else{
      res.status(401).json("Otp was not Send")
    }
  }).catch(err=>{
    //console.log(err)
    res.status(401).json(err)
  })
})
router.post("/auth/verify-reset-code",async(req,res)=>{
  //console.log("verify otp was called")
  const otp=req.body.code
  const email=req.body.email
  await verifyOtp(otp,email).then((result)=>{
    res.status(200).json(true)
  }).catch(err=>{
    res.status(401).json(err)
  })
})
router.post("/auth/reset-password",async(req,res)=>{
  //console.log("reset password api called")
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
router.post("/social/upload",upload.fields([{name:"PostImage",maxCount:1}]),async(req,res)=>{
  console.log("social upload is called ")
  try {
    console.log(req.headers['content-type']); 
    let userresult=await getuserid(req.headers)
    let id=userresult.userId;
    let user=await usermodel.findById(new ObjectId(id))
  //console.log(req.body)
  //console.log(req.file)
    const postFile = req.files['PostImage'] ? req.files['PostImage'][0] : null;
    let postpicname = postFile ? postFile.filename : null;
    console.log("postpicname pic name is "+postpicname)
  let caption=req.body.caption
  let location=req.body.location

  await uploadpost(id,postpicname,caption,location).then((result)=>{
    //console.log(result)
    if(result){
      res.status(200).json(result)
    }
  }).catch(err=>{
    //console.log(err)
    res.status(400).json(err)
  })
}
catch(err){
  //console.log(err)
  res.status(400).json(err)
}
}
)


//get friends list for socket server

router.get("/api/get-friends/:id",async(req,res)=>{
  try{
    
    const id=req.params.id
    await getAllFriends(id).then((result)=>{
      //console.log(result)
      if(result)
      {
        res.status(200).json(result)
      }
    }).catch(err=>{
      //console.log(err)
      res.status(400).json(err)
    })
  }catch(err)
  {
    //console.log(err)
    res.status(400).json(err)
  }
})

//router to get username based on the id
router.get("/api/get-friendname/:id",async(req,res)=>{
  try {
    //console.log("called get friendname api=========")
    let userid=req.params.id
    ////console.log(userid)
    await getFriendName(userid).then((response)=>{
      if(response)
      {
        //console.log(response)
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
    //console.log(groupData)
    await createGroup(header,groupData).then((result)=>{
      if(result)
      {
        //console.log("Group created successfully",result._id)
        res.status(200).json(result._id);

      }else{
        res.status(400).json({message:"Failed to create group"})
      }
    }).catch((error)=>{
      //console.log("Error in creating group",error)
      res.status(400).json({message:"Error in creating group",error})
    })
    
  } catch (error) {
    res.status(400).json({message:"Error while creating group",error})
    //console.log("Error while creating group",error);
  }
})

//api to get user groups 
router.get('/api/socialmedia/groups/user-groups',async(req,res)=>{
  try
  {
    //console.log("Fetching user groups")
    await getUserGroups(req).then((result)=>{
      if(result)
      {
        //console.log("user groups fetched successfully "+result)
        res.status(200).json(result); 
      }
    }).catch((error)=>{
      //console.log("Error in fetching user groups ",error)
      res.status(400).json({message:"Error in fetching user groups",error})
    })
  }catch(error)
  {
    //console.log("Error in fetching user groups",error)
    res.status(400).json({message:"Error in fetching user groups",error})
  }
})

//fetch all groups that is users not part of
router.get('/api/socialmedia/groups/all-groups',async(req,res)=>{
  //console.log("inside all groups api")
  try {
    await getAllgroups(req).then((result)=>{
      if(result)
      {
        res.status(200).json(result);
      }
    })
  } catch (error) {
    //console.log("Error in fetching all groups"+error)
    res.status(400).json({message:"Error in fetching all groups",error})
  }
})
//api to join a group
router.post('/api/socialmedia/groups/join',async(req,res)=>{

  try {
    
    await joinGroup(req).then((result)=>{
      //console.log(result)
      if(result)
      {
        res.status(200).json({message:"Successfully joined the group",result});
      }
    }).catch((error)=>{
      //console.log(error)
      res.status(400).json({message:"Error in joining the group",error})
    })
  } catch (error) {
    res.status(400).json({message:"Error in joining the group",error})
  }
})

//api to handle join request
router.post('/api/socialmedia/groups/request-join',async(req,res)=>{
  try {
    await requestJoinGroup(req).then((result)=>{
      if(result)
      {
        //console.log("join request sent successfully",result)
        res.status(200).json({message:"join request sent successfully",result})
      }
    })
  } catch (error) {
    //console.log("error in handling join request",error)
    res.status(400).json({message:"Error in handling join request",error})
  }
})

//api to get the group name
router.get('/api/get-group-name/:id',async(req,res)=>{
  const id=req.params.id
  try {
    await getGroupname(id).then((response)=>{
      //console.log(response)
      if(response)
      {
        //console.log(response)
        return res.status(200).json(response)
      }
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

//router to handle the accept join request

router.post("/api/socialmedia/groups/join-accept",async(req,res)=>{
  try {
    //console.log("handle join request is called")
    await Acceptgroupjoin(req.body).then(result=>{
      if(result)
      {
        return res.status(200).json(result);
      }
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

router.post("/api/socialmedia/groups/join-reject",async(req,res)=>{
  try {
    //console.log("handle join request is called")
    await Rejectgroupjoin(req.body).then(result=>{
      if(result)
      {
        return res.status(200).json(result);
      }
    })
  } catch (error) {
    return res.status(400).json(error)
  }
})

//router for saving the fcm token 
router.post("/api/save-token",async(req,res)=>{
  //console.log("Called save fcm token")
  try {
    let user=await getuserid(req.headers)
    //console.log(user)
    if(user)
    {
      await saveFcm(req.body,user.userId).then((result)=>{
        if(result)
        {
          return res.status(200).json(true)
        }
      })
    }
  } catch (error) {
    
  }
  //console.log(req.body)
})

//router to get the fcm token 

router.get("/api/get-fcm-token/:id",async(req,res)=>{
  try {
    let id=req.params.id;
    await getFcm(id).then((result)=>{
      return res.status(200).json(result)
    }).catch(err=>{
      return res.status(400).json(err)
    })
  } catch (error) {
    return res.status(400).json(err)
  }
})


//router to post the notification
router.post("/api/post-notification",async(req,res)=>{
  console.log("Post notification api called ")
  try {
    //console.log(req.body)
    await saveNotification(req.body).then((result)=>{
      if(result)
      {
        console.log("Notification saved successfully")
        return res.status(200).json(true);
      }
    })
  } catch (error) {
    console.log("Error saving notification:", error);
    return res.status(400).json(false);
  }
})

//router to get the nofification from the database
router.get("/api/socialmedia/get-notifications",async(req,res)=>{
  try {
    let user=await getuserid(req.headers);
    if(user)
    {
      await getNotification(user.userId).then((result)=>{
        //console.log(result)
        if(result){
          return res.status(200).json(result);
        }
      })
    }
  } catch (error) {
    return res.status(400).json({message:"Error fetching notifications",error});
  }
})

//router to post the notification as read
router.post("/api/socialmedia/mark-notification-as-read",async(req,res)=>{
  try {
    console.log("mark notification as read called");
   let user=await getuserid(req.headers);
   if(user)
   {
    await markNotificationAsRead(req.body).then((result)=>{
      if(result)
      {
        //console.log("Notification marked as read successfully");
        return res.status(200).json(true);
      }
    })
   }
  } catch (error) {
    
  }
})

//router to mark the notification as read
router.post("/api/socialmedia/mark-notification-as-seen",async(req,res)=>{
  try {
    //console.log("mark notification as seen called");
    await markNotificationAsSeen(req.body).then((result)=>{
      if(result)
      {
        //console.log("Notification marked as seen successfully");
        return res.status(200).json(result);
      }
    })
  } catch (error) {
    //console.log("Error marking notification as seen:", error);
    return res.status(400).json(false);
  }
})

  //router to get the group status
  router.get('/api/socialmedia/groups/get-group-status', async (req, res) => {
    try{
      await groupStatus(req).then((result)=>{
        if(result)
        {
          res.status(200).json(result);
        }
      })

    }catch(error)
    {
      //console.log("Error getting group status:",error);
      res.status(400).json({message:"Error getting group status",error})
    }
})

//router to get the username

router.get("/api/socialmedia/get-username",async(req,res)=>{
  //console.log("get name ")
  await getName(req).then((result)=>{
    res.status(200).json({result})
  }).catch((error)=>{
    res.status(400).json({error})
  })
})

//router to save the group message

router.post("/api/socialmedia/group-message",async(req,res)=>{
  try {
    //console.log("called the save message")
      await saveGroupMessage(req).then((result)=>{
   res.status(200).json({result})
  })
  } catch (error) {
    res.status(400).json({error})
  }

})

//router to fetch the group messages 
router.get("/api/social-media/fetch-message/:id",async(req,res)=>{
  try {
    let id=req.params.id
    //console.log("group id is ===="+id)
      let message=await fetchGroupmessage(id)
      res.status(200).json(message)
  } catch (error) {
    res.status(400).json(error)
  }
})

//router to fetch members
router.get("/api/socialmedia/fetch-members/:id",async(req,res)=>{
  try {
    //console.log("fetch members called ")
    let id=req.params.id
    let user=await getuserid(req.headers)
    //console.log(user)
    let userid=user.userId
    //console.log("user id from fetchmembers is ==="+userid)
    let userobj={user:userid,groupid:id}
    //console.log("id from fetch members is ===="+id)
    let response=await fetchGroupmembers(userobj)
    //console.log("response is "+response)
    res.status(200).json(response)
  } catch (error) {
    //console.log(error)
    res.status(400).json(error)
  }
})

//router to fetch the active users 
router.get("/api/social-media/get-active-users/:id",async(req,res)=>{
  console.clear();
  let id=req.params.id
  console.log("user from fetch active is "+id)
  console.log("fetch active users called")
  await fetchActiveusers(id).then((result)=>{
    if(result)
    {
      res.status(200).json(result)
    }
  }).catch((err)=>{
    ////console.log(err)
    res.status(400).json(err)
  })
})

//router to update the notification status as read

router.post("/api/socialmedia/notification/status",async(req,res)=>{
  try {
    
  } catch (error) {
    
  }
})



module.exports=router;
/*"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJha2hpbCIsImlhdCI6MTcyMDIwMDc4MCwiZXhwIjoxNzIwMjA0MzgwfQ.5ZZmIz4SxIqWv3UCDBGN39cCbjBRNdGNimq1e6RY31w"*/