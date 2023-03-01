var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

// // Try to get token cokie
// var token = document.cookie.split(';').find(row => row.trim().startsWith('token=')).split('=')[1];
// // If not find token redirect to auth/index.html
// if (token == undefined) {
//     window.location.href = "http://localhost:3000/auth/index.html";
// }

// Event listener

// Function for add message
function addMessage(msg) {
    var messages = document.getElementById('messages');
    var item = document.createElement('li');
    // If lenght greather than 100 break the line
    if (msg.length > 100) {
        msg = msg.match(/.{1,100}/g).join("<br>");
    }
    item.innerHTML = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
} 


socket.on('disconnect', () => {
    console.log('You were disconnected');
    addMessage("Disconnected by idling reload page for reconect.");
});

socket.on('chat-message', function(msg) {
        // If lenght greather than 4000 chars send alert
        if (msg.length > 4000) {
            alert("Message too long");
            return;
        }
        else{
            addMessage(msg);
        }
    
});

socket.on('get-active-users', function(msg) {
    console.log(msg);
});

// Ask for chat data on connection
socket.on('connect', () => {
    socket.emit('load-messages');
    socket.emit('get-active-users')
});

// Recive chat data from server
socket.on('load-messages', function(msg) {
    // Verify if section id is the same as the client section id
    if (msg.id == socket.id) {
        // Loop through all messages
        for (let i = 0; i < msg.message.length; i++) {
            // Add message to chat
            addMessage(msg.message[i].message);
        }
        // Scroll to bottom of messages
        window.scrollTo(0, document.body.scrollHeight);
    }
});                                


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {

        // Send message to server
        socket.emit('chat-message', input.value);
        socket.emit('get-active-users')

        input.value = '';
    }
});