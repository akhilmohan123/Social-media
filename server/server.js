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
app.use(express.urlencoded({
    extended: true
}))
 


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
