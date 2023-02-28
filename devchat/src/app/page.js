'use client';

import { useEffect } from 'react';
import { io } from "socket.io-client";
import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


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


  

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" variant="outlined" />
    </Box>
  )
}

export default Home;