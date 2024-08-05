var express = require("express");
var app = express();
var user = require("./routes/user");
var messagerouter = require("./routes/messageroute");
var friend = require("./routes/friend");
var chatrouter = require("./routes/Chatroute");
var connection = require("./connection/connection");
var openairouter = require("./routes/openai");
var bodyParser = require("body-parser");
var cors = require("cors");
const path = require("path");
require("dotenv").config();
connection();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.urlencoded({
//     extended: true
// Serve static files from the React app
const io = require("socket.io")(8800, {
  cors: {
    orgin: "http://localhost:3001",
  },
});
let activeusers = [];

io.on("connection", (socket) => {
  //add new user
  socket.on("new-user-add", (newUserId) => {
    //if user is not added previously
    if (!activeusers.some((user) => user.userid === newUserId)) {
      activeusers.push({ userid: newUserId, socketId: socket.id });
      console.log("New user connected", activeusers);
    }
    io.emit("get-users", activeusers);
  });
  // send message to a specific user
  socket.on("send-message", (data) => {
    const { receiverId } = data;
    const user = activeusers.find((user) => user.userId === receiverId);
    console.log("Sending from socket to :", receiverId);
    console.log("Data: ", data);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });
  socket.on("disconnect", () => {
    activeusers = activeusers.filter((user) => user.socketId !== socket.id);
    console.log("user disconnected", activeusers);
    io.emit("get-users", activeusers);
  });
});
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../client/socialmedia/dist")));

//   // Handle all other routes by sending the React app's index.html
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "../client/socialmedia", "dist", "index.html")
//     );
//   });
// } else {
//   // Handle development environment
//   app.use(express.static(path.join(__dirname, "../client/socialmedia/public")));
//   app.get("*", (req, res) => {
//     res.sendFile(
//       path.resolve(__dirname, "../client/socialmedia", "public", "index.html")
//     );
//   });
// }
app.use("/", user);
app.use("/", friend);
app.use("/chat", chatrouter);
app.use("/message", messagerouter);
app.use("/ai", openairouter);

app.listen(3001, () => {
  console.log("server is listening to the port");
});
