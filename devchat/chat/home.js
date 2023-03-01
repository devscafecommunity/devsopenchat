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
socket.on('disconnect', () => {
    var item = document.createElement('li');
    item.textContent = "Disconnected by idling reload page for reconect."
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('chat-message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
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
            // Create new list item
            var item = document.createElement('li');
            // Set list item text to message
            item.textContent = msg.message[i].message;
            // Append list item to messages
            messages.appendChild(item);
        }
        // Scroll to bottom of messages
        window.scrollTo(0, document.body.scrollHeight);
    }
});                                


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat-message', input.value);
      socket.emit('get-active-users')

      input.value = '';
    }
});