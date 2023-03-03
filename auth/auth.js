var socket = io();

// Verify if cokies are set
if (document.cookie.split(';').find(row => row.trim().startsWith('logged=')) != undefined) {
    // Get logged cokie
    var logged = document.cookie.split(';').find(row => row.trim().startsWith('logged=')).split('=')[1];
    // If logged is true redirect to home
    if (logged == "true") {
        window.location.href = "/chat/home.html";
    }
}

// Get form
const loginform = document.getElementById('loginform');
const registerForm = document.getElementById('registerForm');

function setCokies(username){
    // Set validator cokie
    // ttl of cokie 1day
    
    document.cookie = "username=" + username + ";max-age=86400";
    document.cookie = "logged=" + true + ";max-age=86400";

    // Redirect to self
    window.location.href = "/";
}

// On login submit
loginform.addEventListener('submit', function(e) {
    e.preventDefault();
    // Get username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Send data to server
    socket.emit('login', {
        username,
        password,
        id: socket.id
    });
});

// On register submit
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Get username and password
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    // Send data to server
    socket.emit('register', {
        username,
        password,
        email,
        id: socket.id
    });
});

// Recive login data from server
socket.on('login', function(msg) {
    // Verify if section id is the same as the client section id
    if (msg.id == socket.id) {
        // If username is not undefined set cokies
        if (msg.username != undefined) {
            setCokies(msg.username);
        }
        else{
            alert("Wrong username or password");
        }
    }
});

// Recive register data from server
socket.on('register', function(msg) {
    // Verify if section id is the same as the client section id
    if (msg.id == socket.id) {
        // If username is not undefined set cokies
        if (msg.username != undefined) {
            setCokies(msg.username);
        }
        else{
            alert("Username already taken");
        }
    }
});