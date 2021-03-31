import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import AssignmentIcon from '@material-ui/core/Assignment'
import PhoneIcon from '@material-ui/core/Phone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import './App.css';

const socket= io.connect('http://localhst:5000')

const App= () => {

  const myVideo= useRef()
  const userVideo= useRef()
  const connectionRef= useRef()

  return (
    <div className="App">
     
    </div>
  );
}

export default App;
