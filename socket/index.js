const { spawn } = require("child_process");
const axios = require("axios");
const io = require("socket.io")(8800, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
  },
});

let ffmpegProcess = null;
let activeusers = []; // { userid, socketId }
let liveWrite=false

// Modified FFmpeg startup
function startFFmpegProcess() {
  
  ffmpegProcess = spawn('ffmpeg', [
    '-f', 'matroska',    // Better for chunked input
    '-i', 'pipe:0',
    '-fflags', '+genpts',
    '-r', '30',
    
    // Video
    '-c:v', 'libx264',
    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-pix_fmt', 'yuv420p',
    '-g', '60',
    '-b:v', '2500k',
    
    // Audio
    '-c:a', 'aac',
    '-b:a', '128k',
    '-ar', '44100',
    '-ac', '2',
    
    // Output
    '-f', 'flv',
    'rtmp://localhost:1935/hls/stream'
  ], {
    stdio: ['pipe', 'inherit', 'inherit'] // Better error visibility
  });
ffmpegProcess.stdin.setMaxListeners(50);
  // Error handling
  ffmpegProcess.on('error', (err) => {
    console.error('FFmpeg process error:', err);
  });

  ffmpegProcess.on('exit', (code) => {
    console.log(`FFmpeg exited with code ${code}`);
  });
  return ffmpegProcess
}
// async function to get friends list for a user ID
async function getFriendsList(id) {
 try {
    console.log(`user  ${id} calling the friend `)
    const response = await axios.get(`http://localhost:3001/api/get-friends/${id}`);
    console.log("Friends from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    return [];
  }
}

//get frends name
async function getFriendname(id)
{
  try{
  const response=await axios.get(`http://localhost:3001/api/get-friendname/${id}`)
  console.log("before response")
  console.log(response.data)
   return response.data
  }catch(err)
  {
    console.log(err)
  }
}

//function to get the user name

async function getUsername(id)
{
  const response=await axios.get(`http://localhost:3001/api/get-friends-name/${id}`)
  console.log("friends name is ======"+response.data)
}
let usersStreaming = new Set();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Add new user
  socket.on("new-user-add", (newUserId) => {
    console.log("user id from server is "+newUserId)
    if (!activeusers.some((user) => user.userid === newUserId)) {
      activeusers.push({ userid: newUserId, socketId: socket.id });
      console.log("Active users:", activeusers);
    }
    io.emit("get-users", activeusers);
  });

  // Send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeusers.find((user) => user.userid === receiverId); // fixed casing
    console.log("Sending message to:", receiverId);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  // Live streaming data from client
  let ffmpegStarted = false;
  let bufferQueue = [];

socket.on("live-stream", async({userId, data }) => {
  console.log("user id started stream ========= "+userId)

  console.log(activeusers)
  const buffer = Buffer.from(data);

  if (!ffmpegStarted) {
    bufferQueue.push(buffer);

    if (bufferQueue.length >= 1) {
      ffmpegProcess = startFFmpegProcess();

      // Write all buffered data
      for (const buf of bufferQueue) {
        ffmpegProcess.stdin.write(buf);
      }

      ffmpegStarted = true;
    }
  } else {
    // Regular streaming
    const canWrite = ffmpegProcess.stdin.write(buffer);
    if (!canWrite) {
      ffmpegProcess.stdin.once('drain', () => {
        ffmpegProcess.stdin.write(buffer);
      });
    }
  }
 if (!usersStreaming.has(userId)) {
    console.log("insidethe userstreaming")
    usersStreaming.add(userId);
      const friendsarray=await getFriendsList(userId)//get the friendarray
      const friendName=await getFriendname(userId) 
      let friend = friendName.split("true")[1];//get friend name 
      console.log("friend name is =========="+friend)
      console.log("Friendsarray----",friendsarray)
  friendsarray.forEach((friendId) => {
    const cleanId = String(friendId).trim();
    if(cleanId==String(userId).trim())
    {
      console.log("user with same socket id "+cleanId)
      return;
    }
    console.log("Searching for friendId:", cleanId);
    console.log(activeusers)
  activeusers.forEach((user) => {
    console.log("Active user ID:", user.userid, "===", cleanId, "?", user.userid === cleanId);
  });
  const friendSocket = activeusers.find(user => String(user.userid).trim() === cleanId);
  console.log("firend socket is -------"+friendSocket)
  console.log(friendSocket)
  if (friendSocket) {
    console.log("emitting")
    io.to(friendSocket.socketId).emit("live-stream-friend",{id:friendSocket.userid,name:friend});
    console.log(`Emitting to friend ${friendId} at socket ${friendSocket.socketId}`);
  }
});
 }else
 {
  console.log(usersStreaming)
  console.log("user streaming not found")
 }
});

socket.on('error', (err) => {
  console.error('Socket error:', err.message);
})
  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
   
     console.log("Socket disconnected:", socket.id);

  // Find the disconnected user's ID before removing them
  const disconnectedUser = activeusers.find(user => user.socketId === socket.id);

  if (disconnectedUser) {
    const userId = disconnectedUser.userid;

    // Remove from streaming set if present
    if (usersStreaming.has(userId)) {
      usersStreaming.delete(userId);
      console.log(`Removed ${userId} from usersStreaming`);
    }
  }
   activeusers = activeusers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeusers);

    // If no more users, close ffmpeg
    // if (activeusers.length === 0 && ffmpegProcess) {
    //   ffmpegProcess.stdin.end();
    //   ffmpegProcess.kill("SIGINT");
    //   ffmpegProcess = null;
    //   console.log("FFmpeg process stopped due to no users");
    // }
  });
});
