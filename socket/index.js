const io=require("socket.io")(8800,{
    cors:{
        orgin:"http://localhost:3001",
    }
})
let activeusers=[]

io.on("connection",(socket)=>{
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
    socket.on("disconnect",()=>{
        activeusers=activeusers.filter((user)=>user.socketId!==socket.id);
        console.log("user disconnected",activeusers)
        io.emit("get-users",activeusers);
    })
    
})