/*
###################################################################################################

    Devs Café Bussy devs © 2022

###################################################################################################
*/
// DotEnv
require('dotenv').config();

const path = require('path');
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const Chat = require('./models/chat');
const io = new Server(server);
const request = require('request');

const fs = require('fs');
const badwords = require(
  // './badwords.json' Use path
  path.join(__dirname, 'badwords.json')
)
// --------------------------------- Keys -------------------------------------------
let GIPHY_KEY = process.env.GIPHY_KEY;


const { ChatCrud } = require(
  // './controllers/ChatCrud' Use path 
  path.join(__dirname, 'controllers', 'ChatCrud')
);
const { UserCrud } = require(
  // './controllers/UserCrud' Use path
  path.join(__dirname, 'controllers', 'UserCrud')
);

app.get("/chat/:req", (req, res) => {
  // res.sendFile(__dirname + "/chat/" + req.params.req);
  res.sendFile(path.join(__dirname, 'chat', req.params.req));
});

app.get("/", (req, res) => {
  // res.sendFile(__dirname + "/chat/" + "home.html");
  res.sendFile(path.join(__dirname, 'chat', 'home.html'));
});



// let active_users = [];

// function add_user(user) {
//   active_users.push(user);
// }

// function remove_user(user) {
//   active_users = active_users.filter((u) => u.id != user.id);
// }

let commands = {
  "help": {
    "description": "List all commands",
    "usage": "/help",
    "function": async (msg, args) => {
      return Object.keys(commands).map((key) => {
        return `${key} - ${commands[key].description} - ${commands[key].usage} <br />`;
      });
    },
  },
  "dogpic": {
    "description": "Get a random dog picture",
    "usage": "/dogpic",
    "function": async (msg, args) => {
      let result = await new Promise((resolve, reject) => {
        request('https://dog.ceo/api/breeds/image/random', { json: true }, (err, res, body) => {
          if (err) { reject(err); }
          let rer = `
            <img src="${body.message}">
          `;
          resolve(rer);
        });
      });
      return result;
    }
  },
  // "giphy": {
  //   "description": "Get a gif from giphy",
  //   "usage": "/giphy <search>",
  //   "function": async (msg, args) => {
  //     // http://api.giphy.com/v1/gifs/search?q=ryan+gosling&api_key=YOUR_API_KEY&limit=1
  //     /*
  //     Return:
  //     {
  //       "data": [
  //         {
  //           "type": "gif",
  //           "id": "MeIucAjPKoA120R7sN",
  //           "url": "https://giphy.com/gifs/MeIucAjPKoA120R7sN", <- What we want
  //           "slug": "MeIucAjPKoA120R7sN",
  //           "bitly_gif_url": "https://gph.is/g/4AykB7O",
  //           "bitly_url": "https://gph.is/g/4AykB7O",
  //           "embed_url": "https://giphy.com/embed/MeIucAjPKoA120R7sN",
  //           "username": "bluesbear",
  //           "source": "",
  //           "title": "Happy Cheering GIF by bluesbear",
  //           "rating": "g",
  //           ...
  //     */
  //     let result = await new Promise((resolve, reject) => {

  //       let url = `http://api.giphy.com/v1/gifs/search?q=${args.join("+")}&api_key=${GIPHY_KEY}&limit=1`;
  //       let notresponse = "https://media.tenor.com/FM2b-I7t8S4AAAAC/discord-about-me.gif"
  //       request(url, { json: true }, (err, res, body) => {
  //         if (err) { reject(err); }
  //         let rer = `
  //           <img src="${body.data[0]?.url ?? notresponse}">
  //         `;
  //         resolve(rer);
  //       }
  //       );
  //     });
  //     return result;
  //   }
  // },
  "duckgo": {
    "description": "Make a seach in duck go",
    "usage": "/duckgo <search>",
    "function": async (msg, args) => {
      let result = await new Promise((resolve, reject) => {
        let url = `https://api.duckduckgo.com/?q=${args.join("+")}&format=json&pretty=1`;

        request(url, { json: true }, (err, res, body) => {
          if (err) { reject(err); }
          let rer = `
            <img src="${body.Image ?? ""}">
            <p>${body.AbstractText ?? ""}</p>
            <a href="${body.AbstractURL ?? ""}">${body.AbstractURL ?? ""}</a>
          `;
          resolve(rer);
        });
      });
      return result;
    }
  },
  "clear": {
    "description": "Clear the chat",
    "usage": "/clear",
    "function": async (msg, args) => {
      let result = await new Promise((resolve, reject) => {

        let chat = ChatCrud;
        chat.clearAll();

        // Disconect all users from socket
        io.sockets.emit("clear");
        resolve("Chat cleared");
      });
      return result;
    }
  },
  }

// // Content filters

// Is a html tag
function isHTML(str) {
  // regex
  var a = /<[a-z][\s\S]*>/i;
  if (a.test(str)) {
    return true;
  }
}

// Is a script tag
function isScript(str) {
  // regex
  var a = /<script[\s\S]*>/i;
  if (a.test(str)) {
    return true;
  }
}




async function commandHandler(imput){
  let args = imput.split(" ");
  let command = args.shift();
  let msg = args.join(" ");
  command = command.slice(1);

  console.log(command);
  if (command in commands){
    return commands[command].function(msg, args);
  }
  else{
    return "Command not found";
  }
}

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
    // io.emit("chat-message", msg);

    // Prevent overload connection
    if (msg.length > 4000) {
      socket.disconnect(true); // close the connection
    }

    // Prevent html tags
    if (isHTML(msg)) {
      socket.disconnect(true); // close the connection
    }

    // Prevent script tags
    if (isScript(msg)) {
      socket.disconnect(true); // close the connection
    }

    // Prevent badwords
    if (isBadWord(msg)) {
      socket.disconnect(true); // close the connection
    }

    // Verify if is a command
    if (msg.startsWith("/")){
      // Turn async
      (async () => {
        let result = await commandHandler(msg).then((res) => {
          io.emit("chat-message", {
            id: socket.id,
            message: res,
          });
        })
      }
      )();
    }
    else{
      io.emit("chat-message", {
        id: socket.id,
        message: msg,
      });
      let chat = ChatCrud;
      chat.create(msg, 1);
    }

    console.log("Message sent")
    resetTimeout();
  });
});


server.listen(3000, () => {
  console.log("Serving on port 3000");
});
