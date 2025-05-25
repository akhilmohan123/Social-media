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
    const response = await axios.get(`http://localhost:3001/api/get-friends/${id}`);
    console.log("Friends from server:", response.data);
    return response.data; // expect array of friend user IDs
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    return [];
  }
}

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Add new user
  socket.on("new-user-add", (newUserId) => {
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

socket.on("live-stream", ({ data }) => {
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
});

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
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
