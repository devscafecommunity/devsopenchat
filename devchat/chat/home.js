var socket = io();

var form = document.getElementById('form');
var input = document.getElementById('input');

// Try to get token cokie
var token = document.cookie.split(';').find(row => row.trim().startsWith('token=')).split('=')[1];
// If not find token redirect to auth/index.html
if (token == undefined) {
    window.location.href = "http://localhost:3000/auth/index.html";
}

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


form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
      socket.emit('chat-message', input.value);
      socket.emit('get-active-users')

      input.value = '';
    }
});