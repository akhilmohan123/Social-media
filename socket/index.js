const { spawn } = require("child_process");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { response } = require("express");
const io = require("socket.io")(8800, {
  cors: {
    origin: ["http://localhost:3001", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 5000,
});

let ffmpegProcess = null;
let activeusers = []; // { userid, socketId }
let liveWrite = false;

// Modified FFmpeg startup
function startFFmpegProcess() {
  ffmpegProcess = spawn(
    "ffmpeg",
    [
      "-f",
      "matroska", // Better for chunked input
      "-i",
      "pipe:0",
      "-fflags",
      "+genpts",
      "-r",
      "30",

      // Video
      "-c:v",
      "libx264",
      "-preset",
      "ultrafast",
      "-tune",
      "zerolatency",
      "-pix_fmt",
      "yuv420p",
      "-g",
      "60",
      "-b:v",
      "2500k",

      // Audio
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-ar",
      "44100",
      "-ac",
      "2",

      // Output
      "-f",
      "flv",
      "rtmp://localhost:1935/hls/stream",
    ],
    {
      stdio: ["pipe", "inherit", "inherit"], // Better error visibility
    }
  );
  ffmpegProcess.stdin.setMaxListeners(50);
  // Error handling
  ffmpegProcess.on("error", (err) => {
    console.error("FFmpeg process error:", err);
  });
  ffmpegProcess.stdin.on("error", (err) => {
    console.error("FFmpeg stdin error:", err.message);
  });
  ffmpegProcess.on("exit", (code) => {
    console.log(`FFmpeg exited with code ${code}`);
    ffmpegProcess = null;
    ffmpegStarted = false;
    bufferQueue = [];
  });
  return ffmpegProcess;
}
//function to get the group name

async function getGroupname(id) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/get-group-name/${id}`
    );
    // console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching group name:", error);
  }
}

// async function to get friends list for a user ID
async function getFriendsList(id) {
  try {
    // console.log(`user  ${id} calling the friend `)
    const response = await axios.get(
      `http://localhost:3001/api/get-friends/${id}`
    );
    // console.log("Friends from server:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching friends:", error.message);
    return [];
  }
}

//get frends name
async function getFriendname(id) {
  try {
    const response = await axios.get(
      `http://localhost:3001/api/get-friendname/${id}`
    );
    //console.log("before response")
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log(err);
  }
}

//function to get the user name

async function getUsername(id) {
  await axios
    .get(`http://localhost:3001/api/get-friendname/${id}`)
    .then((response) => {
      //console.log("friends name is from getusername ======"+response.data)
      return response.data;
    });
}
//function to post the notification data

async function PostNotificationData(notificationData) {
  try {
    await axios
      .post("http://localhost:3001/api/post-notification", notificationData)
      .then((response) => {
        // console.log("notification data posted successfully"+response.data)
        return response.data;
      });
  } catch (error) {
    console.error("Error posting notification data:", error);
    return false;
  }
  if (response) return response.data;
}

//function to mark notification as read
async function markNotificationAsRead({ userId, type }) {
  try {
    var result = await axios.post(
      "http://localhost:3001/api/socialmedia/mark-notification-as-seen",
      {
        userId: userId,
        type: type,
      }
    );
    console.log("Notification marked as read:", result.data);
  } catch (err) {
    console.log("Error in marking notification as read", err);
    return err;
  }
  return result.data;
}

async function saveMessage(message) {
  let result = await axios.post(
    "http://localhost:3001/api/socialmedia/group-message",
    message
  );
  return result;
}

//function to get the active users that is the friend

async function fetchActiveuser(data) {
  try {
    console.log("called the function ");
    const result = await axios.get(
      `http://localhost:3001/api/social-media/get-active-users/${data}`
    );
    console.log(result.data);
    return result.data;
  } catch (error) {
    console.error("Error in fetchActiveuser:", error.message);
    return []; // ✅ Return empty array instead of error object
  }
}

let usersStreaming = new Set();
const userNotificationMap = new Map();
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.onAny((event, ...args) => {
    console.log("Event received:", event, args);
  });
  // Add new user
  socket.on("new-user-add", async (newUserId) => {
    console.log("user id from server is " + newUserId);
    if (!activeusers.some((user) => user.userid === newUserId)) {
      activeusers.push({ userid: newUserId, socketId: socket.id });
      console.log("Active users:", activeusers);
    }
    io.emit("get-users", activeusers);
    let activeMembers = [];
    activeusers.forEach((u) => {
      activeMembers.push(u.userid);
    });

    //loop though the active users list'
    await Promise.all(
      activeusers.map(async (element) => {
        let friends = await fetchActiveuser(element.userid);
        if (Array.isArray(friends)) {
          let friendsOnline = friends.filter((u) =>
            activeMembers.includes(u.userid)
          );
          io.to(element.socketId).emit("friends-list", friendsOnline);
        } else {
          console.warn("Expected array but got:", friends);
        }
      })
    );
  });

  // Send message to a specific user
  socket.on("send-message", (data) => {
    console.log(typeof data)
    const  receiverId  = data.recieverId;
    const user = activeusers.find((user) => user.userid === receiverId); // fixed casing
    console.log("Sending message to:", receiverId);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  // Live streaming data from client
  let ffmpegStarted = false;
  let bufferQueue = [];

  socket.on("live-stream", async ({ userId, data }) => {
    try {
      let notificationid;
      if (userNotificationMap.has(userId)) {
        notificationid = userNotificationMap.get(userId);
      } else {
        notificationid = uuidv4();
      }
      userNotificationMap.set(userId, notificationid);
      const friendName = await getFriendname(userId);
      let friend = friendName.split("true")[1]; //get friend name
      console.log("friend name for storinng the database of user is " + friend);
      console.log("notification id for stroing is " + notificationid);
      const notificationData = {
        notification_id: notificationid,
        user_id: userId,
        user_name: friend,
        type: "live-stream",
      };
      console.log("notification data is " + notificationData);
      let result = await PostNotificationData(notificationData);
      if (result) {
        console.log("Notification sent successfully");
      }
      console.log("user id started stream ========= " + userId);

      console.log(activeusers);
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
        if (ffmpegProcess && ffmpegProcess.stdin.writable) {
          const canWrite = ffmpegProcess.stdin.write(buffer);
          if (!canWrite) {
            ffmpegProcess.stdin.once("drain", () => {
              ffmpegProcess.stdin.write(buffer);
            });
          }
        }
      }
      if (!usersStreaming.has(userId)) {
        console.log("insidethe userstreaming" + userId + "the user id is this");
        usersStreaming.add(userId);
        const friendsarray = await getFriendsList(userId); //get the friendarray
        console.log("friend name is ==========" + friend);
        console.log("Friendsarray----", friendsarray);

        friendsarray.forEach(async (friendId) => {
          const cleanId = String(friendId).trim();
          if (cleanId == String(userId).trim()) {
            console.log("user with same socket id " + cleanId);
            return;
          }
          console.log("Searching for friendId:", cleanId);
          console.log(activeusers);
          activeusers.forEach((user) => {
            console.log(
              "Active user ID:",
              user.userid,
              "===",
              cleanId,
              "?",
              user.userid === cleanId
            );
          });
          const friendSocket = activeusers.find(
            (user) => String(user.userid).trim() === cleanId
          );
          console.log("firend socket is -------" + friendSocket);
          console.log(friendSocket);
          if (friendSocket) {
            // ✅ Online — emit via socket
            io.to(friendSocket.socketId).emit("live-stream-friend", {
              notification_id: notificationid,
              id: friendSocket.userid,
              name: friend,
            });
          } else {
            // ❌ Offline — fallback to push notification
            console.log("user id for fcm is ====" + cleanId);
            const response = await axios.get(
              `http://localhost:3001/api/get-fcm-token/${cleanId}`
            );
            if (response.data) {
              console.log("FCM Tokens:", response.data);
              let username = await getFriendname(cleanId);
              console.log("inside the response data");
              const sendPush = require("./utils/sendPushNotification");
              await sendPush(response.data, {
                title: `${username} started live!`,
                body: `Accept or Reject.`,
                data: {
                  type: "live-stream",
                  userId: cleanId,
                  notificationid: notificationid,
                },
              });
            }
          }
        });
      } else {
        console.log(usersStreaming);
        console.log("user streaming not found");
      }
    } catch (err) {
      console.log("something went wrong " + err);
    }
  });
  socket.on("stream-ended", async (data) => {
    console.log(`Stream ended for user ${data.userId}`);
    usersStreaming.delete(data.userId);
    userNotificationMap.delete(data.userId);
    console.log("from stream ended " + usersStreaming);
    await markNotificationAsRead({
      userId: data.userId,
      type: "live-stream",
    }).then((result) => {
      console.log(result);
      io.emit("notification-update", { id: result.notificationid });
    });
    // io.emit("notification-update", {});
  });

  //for group joining request
  socket.on("group-join-request", async ({ groupId, admin, user }) => {
    try {
      let adminUser = activeusers.find((val) => val.userid === admin);
      const notificationid = uuidv4();
      //if admin is  a online
      if (adminUser) {
        console.log("admin is onlne" + admin);
        let username = await getFriendname(user);
        let groupname = await getGroupname(groupId);
        console.log("group name is ====" + groupname);
        console.log("user name is ====" + username);
        //create notification data and store it in the database
        let notificationData = {
          notification_id: notificationid,
          user_id: user,
          user_name: username,
          groupId: groupId,
          groupname: groupname,
          type: "group-joining-request",
        };
        //console.log("notification data is "+notificationData)
        let requestres = await PostNotificationData(notificationData);
        console.log(requestres);
        //console.log("Notification sent successfully")
        console.log("Admin user socket id is " + adminUser.socketId);
        if (adminUser.socketId) {
          console.log("admin user socket id is " + adminUser.socketId);
          io.to(adminUser.socketId).emit("group-joining-request", {
            notificationid,
            groupId,
            user,
            username,
            groupname,
          });
        }
      } else {
        //console.log("Absolutyl inside the else condition")
        //console.log("user id for fcm is ===="+user);
        const response = await axios.get(
          `http://localhost:3001/api/get-fcm-token/${user}`
        );
        let groupname = await getGroupname(groupId);
        let username = await getFriendname(user);
        if (response.data) {
          const sendPush = require("./utils/sendPushNotification");
          await sendPush(response.data, {
            title: `${user} send a friend request!`,
            body: `Accept or Reject.`,
            data: {
              type: "group-joining-request",
              userId: user,
              notificationid: notificationid,
              groupId: groupId,
              groupname: groupname,
              username: username,
            },
          });
        }
      }
    } catch (error) {
      console.error(
        "Error occurred while processing group join request:",
        error
      );
    }
  });

  //group join accept event
  socket.on("group-request-accepted", ({ id, userid }) => {
    let user = activeusers.find((u) => u.userid == userid);
    let userSocketid = user.socketId;
    io.to(userSocketid).emit("Group-Join-Accepted");
  });

  //group-join reject event

  socket.on("group-request-rejected", ({ id, userid }) => {
    let user = activeusers.find((u) => u.userid == userid);
    let userSocketid = user.socketId;
    io.to(userSocketid).emit("Group-join-Rejected");
  });

  //regarding group message
  // Handle group joining
  socket.on("joined-group", ({ Id }) => {
    console.log(Id);
    console.log(`User ${socket.id} joined group ${Id}`);
    socket.join(Id);
    io.to(Id).emit("test");
  });

  // Handle group message sending (independent of when a user joins)
  socket.on("group-message-send", async (message) => {
    console.log("Received group message:", message);
    let result = await saveMessage(message);
    io.to(message.groupID).emit("group-message-recieved", message);
  });



  socket.on("error", (err) => {
    //console.error('Socket error:', err.message);
  });
  //fetch user is online or not
  socket.on("user-online", (data) => {
    console.log(data);
    let status;
    console.log("user online is called ");
    let activeUserIds = activeusers.map((u) => u.userid);
    let isReceiverOnline = activeUserIds.includes(data.recieverId);

    if (isReceiverOnline) {
      console.log("Receiver is online");
      status = true;
    } else {
      console.log("Receiver is NOT online");
      status = false;
    }
    //print the status
    let user = activeusers.find((u) => u.userid == data.senderId);
    console.log(user);
    if (user) {
      let userSocketid = user.socketId;
      io.to(userSocketid).emit("user-online-status", status);
    }
  });

  //fetch the active friends
  socket.on("fetch-active-users", async (userId) => {
    console.log("fetch active users" + userId);
    let activeMembers = [];
    activeusers.forEach((u) => {
      activeMembers.push(u.userid);
    });

    let friends = await fetchActiveuser(userId);
    let onlineFriends = friends.filter((u) => activeMembers.includes(u.userid));
    console.log(onlineFriends);
    let user = activeusers.find((u) => u.userid == userId);
    let userSocketid = user.socketId;
    io.to(userSocketid).emit("friends-list", onlineFriends);
  });

  // Handle disconnect
  socket.on("disconnect", async () => {
    console.log("Socket disconnected:", socket.id);

    //console.log("Socket disconnected:", socket.id);

    // Find the disconnected user's ID before removing them
    const disconnectedUser = activeusers.find(
      (user) => user.socketId === socket.id
    );

    if (disconnectedUser) {
      const userId = disconnectedUser.userid;

      // Remove from streaming set if present
      if (usersStreaming.has(userId)) {
        usersStreaming.delete(userId);
        //console.log(`Removed ${userId} from usersStreaming`);
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

    let activeMembers = [];
    activeusers.forEach((u) => {
      activeMembers.push(u.userid);
    });

    //loop though the active users list'
    await Promise.all(
      activeusers.map(async (element) => {
        let friends = await fetchActiveuser(element.userid);
        let friendsOnline = friends.filter((u) =>
          activeMembers.includes(u.userid)
        );
        io.to(element.socketId).emit("friends-list", friendsOnline);
      })
    );
  });
});
