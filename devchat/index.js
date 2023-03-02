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
const { ChatCrud } = require('./controllers/ChatCrud');
const { UserCrud } = require('./controllers/UserCrud');

app.get("/chat/:req", (req, res) => {
  res.sendFile(__dirname + "/chat/" + req.params.req);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/home/" + "index.html");
});



// let active_users = [];

// function add_user(user) {
//   active_users.push(user);
// }

// function remove_user(user) {
//   active_users = active_users.filter((u) => u.id != user.id);
// }


// Socket + Prevent inactive and prevent overload connection
io.on("connection", (socket) => {
  console.log("User connected");

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
    }, (60000 * 60)); // 1 hour
  }
  resetTimeout();
  


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
    // clearTimeout(timeout);
  });


  socket.on("chat-message", (msg) => {
    io.emit("chat-message", msg);

    let chat = ChatCrud;
    chat.create(msg, 1);

    console.log("Message sent")
    resetTimeout();
  });
});


server.listen(3001, () => {
  console.log("Serving on port 3001");
});
