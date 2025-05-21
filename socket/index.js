const {spawn}=require("child_process");
let ffmpegProcess=null
const io=require("socket.io")(8800,{
    cors:{
        orgin:"http://localhost:3001",
    }
})

//initializing error flag to track the error
let errorflag=false
let activeusers=[]

let friendslist=[];
//calling the function to get the freinds list

async function getFriendsList(id)
{
  try {
      const friend=await axios.get(`http://localhost:3001/getfriends/${id}`)
      console.log("this is the response from the server",friend.data)
      return friend.data
  } catch (error) {
    console.log("Error from socket is ======"+error)
    errorflag=true
  }
 
}


io.on("connection",(socket)=>{
  let ffmpegstatus=false
    //add new user
    socket.on("new-user-add",(newUserId)=>{
        //if user is not added previously
        if(!activeusers.some((user)=>user.userid===newUserId)){
            activeusers.push({userid:newUserId,socketId:socket.id})
            console.log("New user connected",activeusers)
        }
        io.emit("get-users",activeusers);
    })
    // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeusers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId)
    console.log("Data: ", data)
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
  //get the video data as blob from the front end and send it to ffmpeg
  socket.on("live-stream", ({user,data}) => {
    console.log("user is "+user)

    console.log("data is here",data)
    //calls the function to get the friend list
    const friendlist=getFriendsList(user)
    //check the any users in the friend list if user is 
    if(friendlist.length>0)
    {
      friendlist.forEach((friend)=>{
        io.to(friend.socketId).emit("live-stream",{user})
    
      })

    }


    // check ffmpeg process is already running 
    if (!ffmpegProcess) {
      ffmpegProcess = spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-f', 'flv',
        'rtmp://localhost:1935/live/stream' //rtmp endpoint
      ]);

      ffmpegProcess.stderr.on('data', (data) => {
        console.log('FFmpeg stderr:', data.toString());
      });

      ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg exited with code ${code}`);
        ffmpegProcess = null;
      });

      console.log("FFmpeg process started.");
    }

    if (ffmpegProcess) {
      const buffer = Buffer.from(new Uint8Array(data)); // Convert ArrayBuffer to Buffer
      ffmpegProcess.stdin.write(buffer);
    }
  });
    socket.on("disconnect",()=>{
      if(ffmpegProcess){
        ffmpegProcess.stdin.end()
        ffmpegProcess.kill('SIGINT')
      }
        activeusers=activeusers.filter((user)=>user.socketId!==socket.id);
        console.log("user disconnected",activeusers)
        io.emit("get-users",activeusers);
    })
    
})