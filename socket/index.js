const { spawn } = require("child_process");
const axios = require("axios");
const io = require("socket.io")(8800, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true// fixed spelling
  },
});

let ffmpegProcess = null;
let activeusers = []; // { userid, socketId }

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
  socket.on("live-stream", async ({ userId, data }) => {
    try {

      // // Get friends list (await the promise!)
      // const friendList = await getFriendsList(userId);

      // Map friend userIds to their socketIds from activeusers
      // friendList.forEach((friendId) => {
      //   const friendUser = activeusers.find((u) => u.userid === friendId);
      //   if (friendUser) {
      //     io.to(friendUser.socketId).emit("live-stream", { id: userId, data }); // optionally forward data or id
      //   }
      // });

      // Start ffmpeg process if not already running
      if (ffmpegProcess==null) {
        console.log("Starting ffmpeg process...");
        ffmpegProcess = spawn("D:\\Downloads\\ffmpeg-7.1.1-essentials_build\\ffmpeg-7.1.1-essentials_build\\bin\\ffmpeg.exe", [
          "-f", "webm",            // <--- required for MediaRecorder output
  "-i", "pipe:0",
  "-c:v", "libx264",
  "-preset", "ultrafast",
  "-tune", "zerolatency",
  "-f", "flv",
  "rtmp://localhost:1935/live/stream"
        ]);

        ffmpegProcess.stderr.on("data", (chunk) => {
          console.log("FFmpeg stderr:", chunk.toString());
        });

        ffmpegProcess.on("close", (code) => {
          console.log(`FFmpeg exited with code ${code}`);
          ffmpegProcess = null;
        });

        ffmpegProcess.on("error", (err) => {
          console.error("FFmpeg process error:", err);
        });
      }

      if (ffmpegProcess && data) {
        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(new Uint8Array(data));
        ffmpegProcess.stdin.write(buffer);
      }
    } catch (err) {
      console.error("Error in live-stream handler:", err);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
    activeusers = activeusers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeusers);

    // If no more users, close ffmpeg
    if (activeusers.length === 0 && ffmpegProcess) {
      ffmpegProcess.stdin.end();
      ffmpegProcess.kill("SIGINT");
      ffmpegProcess = null;
      console.log("FFmpeg process stopped due to no users");
    }
  });
});
