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
const passport=require("passport")
const path = require("path");
const { googleAuthMiddleWare } = require("./Helper/Authentication");
require("dotenv").config();

connection();


app.use(cors({
  origin: "http://localhost:5173", // allow frontend dev server
  credentials: true               // allow cookies or auth headers
}));
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({  extended: true, limit: '10mb'  }));
app.use(express.urlencoded({
    extended: true
}))
 
//Initialize passport

app.use(passport.initialize());


//setup google auth

googleAuthMiddleWare.initialize(passport)

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
