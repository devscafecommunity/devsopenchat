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
const GIPHY_KEY = process.env.GIPHY_KEY;
const ADMIN_KEY = process.env.ADMIN_KEY;


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
    "isAdmin": false,
    "function": async (msg, args) => {
      // Render a table
      let result = `
        <table>
          <thead>
            <tr>
              <th>Command</th>
              <th>Description</th>
              <th>Usage</th>
            </tr>
          </thead>
          <tbody>
      `;
      for (let key in commands) {
        // Dont render "isAdmin": true,
        if (!commands[key].isAdmin) {
          result += `
            <tr>
              <td>${key}</td>
              <td>${commands[key].description}</td>
              <td>${commands[key].usage}</td>
            </tr>
          `;
        }
      }
      result += `
          </tbody>
        </table>
      `;
      return result;
    },
  },
  "dogpic": {
    "description": "Get a random dog picture",
    "usage": "/dogpic",
    "isAdmin": false,
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
    "isAdmin": false,
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
    "usage": "/clear <admin key>",
    "isAdmin": true,
    "function": async (msg, args) => {
      let result = await new Promise((resolve, reject) => {
        if (args[0] == ADMIN_KEY) {
          let chat = ChatCrud;
          chat.clearAll();
          io.sockets.emit("clear");
          resolve("Chat cleared");
        } else {
          resolve("Invalid admin key");
        }
      });
      return result;
    }
  },
  }

// // Content filters

// Is a html tag
// format <a-zA-Z>*</a-zA-Z>
// also catch if even if not have closing tag <a-zA-Z>*<a-zA-Z>
// also catch if even if not have body <a-zA-Z><a-zA-Z>
// also catch if even if is single <a-zA-Z/> 
// in all cach spaces inside the tag like < a/> < a />
// in all cach special chars

function isHTML(str) {
  // Regex
  let singleNoClosing = /<\s*\w+\s*\/\s*>/g;
  let single = /<\s*\w+\s*\/\s*>/g;
  let noClosing = /<\s*\w+\s*>/g;
  let normal = /<\s*\w+\s*>\s*<\s*\/\s*\w+\s*>/g;
  let normalNoClosing = /<\s*\w+\s*>\s*<\s*\/\s*\w+\s*>/g;

  if (singleNoClosing.test(str) || single.test(str) || noClosing.test(str) || normal.test(str) || normalNoClosing.test(str)) {
    return true;
  }
}

// Renders

// Image
function renderImage(url) {
  return `
    <img src="${url}">
  `;
}

// Link
function renderLink(url) {
  return `
    <a href="${url}">${url}</a>
  `;
}


// Renders verifyers

// Is a image
function isImage(url) {
  // regex
  var a = /(.jpg|.jpeg|.png|.gif|.bmp|.svg|.webp)$/i;
  if (a.test(url)) {
    return true;
  }
}

// Is a link
function isLink(url) {
  // regex
  var a = /((http|https):\/\/)/i;
  if (a.test(url)) {
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

  // Message span 
  let last_message_date = null;
  let message_count = 0;
 
  // Prevent message spam
  function preventSpam() {
    // For prevent span disconnect the user
    if (message_count >= 5) {
      socket.disconnect(true); // close the connection
      io.emit("chat-movment", {
        id: socket.id,
        message: "User user disconnected by spamming.",
      });
      console.log("User disconnected by spamming.");
    }
    // For prevent span disconnect the user
    if (last_message_date != null) {
      if (last_message_date + 1000 > new Date().getTime()) {
        socket.disconnect(true); // close the connection
        io.emit("chat-movment", {
          id: socket.id,
          message: "User user disconnected by spamming.",
        });
        console.log("User disconnected by spamming.");
        return true;
      }
    }
    // Reset the message counter
    if (last_message_date == null) {
      last_message_date = new Date().getTime();
      message_count = 0;
    }
    // Reset the message counter
    if (last_message_date + 1000 < new Date().getTime()) {
      last_message_date = new Date().getTime();
      message_count = 0;
    }
    // Increment the message counter
    message_count++;
    return false;
  }

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

    // Prevent message spam
    preventSpam();
    // Prevent overload connection
    if (msg.length > 4000) {
      socket.disconnect(true); // close the connection
      console.log("User disconnected by overload connection.");
      return;
    }
    
    
    // Prevent html tags
    if (isHTML(msg)) {
      // Send message
      io.emit("chat-message", {
        id: socket.id,
        message: "HTML tag detected",
      });
      socket.disconnect(true); // close the connection
      return;
    }

    // Verify if is a command
    if (msg.startsWith("/")){
      // Prevent message spam
      if(preventMessageSpam()){
        return;
      }

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
      // Renders verifyers
      if (isImage(msg)) {
        msg = renderImage(msg);
      }
      else if (isLink(msg)) {
        msg = renderLink(msg);
      }

      // Send message
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
