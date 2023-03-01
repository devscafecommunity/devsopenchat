/*
###################################################################################################

    Devs Café Bussy devs © 2022

###################################################################################################
*/

const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { ChatCrud, UserCrud } = require('./controllers/ChatCrud');

app.get("/chat/:req", (req, res) => {
  res.sendFile(__dirname + "/chat/" + req.params.req);
});





// Socket + Prevent inactive and prevent overload connection
io.on("connection", (socket) => {
  // Set timeout
  let timeout;

  // Prevent inactive
  function resetTimeout() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      socket.disconnect(true); // close the connection
  
      io.emit("chat-movment", {
        id: socket.id,
        message: "User user disconnected by being idle.",
      });
  
      console.log("User disconnected by being idle.");
    }, 5000); // 1 minute
  }
  resetTimeout();
  
  socket.on("connect", () =>
    io.emit("chat-movment", {
      id: socket.id,
      message: "User user connected",
    })
  )

  socket.on("load-messages", () =>{
    let chat = ChatCrud;
    chat.readAll().then((result) => {
      io.emit("load-messages", {
        id: socket.id,
        message: result,
      });
    });
  })

  socket.on("disconnect", () => {
    io.emit("chat-movment", {
      id: socket.id,
      message: "User user disconnected",
    });

    console.log("User disconnected");
    clearTimeout(timeout);
  });

  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);

    let chat = ChatCrud;
    chat.create(msg, 1);

    console.log("Message sent")
    resetTimeout();
  });

  socket.on("get-active-users", (users) => {
    let activeUsers = socket.listenerCount("connection");
    io.emit("get-active-users", activeUsers);
  });
});

server.listen(3001, () => {
  console.log("Serving on port 3001");
});
