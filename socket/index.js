const {spawn}=require("child_process");
let ffmpegProcess=null
const io=require("socket.io")(8800,{
    cors:{
        orgin:"http://localhost:3001",
    }
})
let activeusers=[]

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
  socket.on("video-data", (data) => {
    if (!ffmpegProcess) {
      ffmpegProcess = spawn('ffmpeg', [
        '-i', 'pipe:0',
        '-c:v', 'libx264',
        '-preset', 'ultrafast',
        '-tune', 'zerolatency',
        '-f', 'flv',
        'rtmp://localhost/live/stream' // or your public RTMP endpoint
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
        activeusers=activeusers.filter((user)=>user.socketId!==socket.id);
        console.log("user disconnected",activeusers)
        io.emit("get-users",activeusers);
    })
    
})