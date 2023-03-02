const { io } = require('socket.io-client');

const socket = io('http://localhost:3002');

socket.on('connect', () => {
    console.log('connected');
    }
);
