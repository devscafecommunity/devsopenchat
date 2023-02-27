'use client';

import { useEffect } from 'react';
import { io } from "socket.io-client";


const Home = () => {
  const { io } = require('socket.io-client');

  const socket = io('http://localhost:3002');
  
  socket.on('connect', () => {
      console.log('connected');
      }
  );

  socket.on('hello', () =>
      console.log('hello')
  );


  return null
}

export default Home;