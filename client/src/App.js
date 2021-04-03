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

  const [me, setMe]= useState('')
  const [stream, setStream]= useState('')
  const [caller, setCaller]= useState('')
  const [receivingCall, setReceivingCall]= useState('')
  const [name, setName]= useState('')
  const [callerSignal, setCallerSignal]= useState('')

  const myVideo= useRef()
  const userVideo= useRef()
  const connectionRef= useRef()

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      setStream(stream)
      myVideo.current.srcObject= stream
    })

    socket.on('me', id => {
      setMe(id)
    })

    socket.on('callUser', (data) => {
        setReceivingCall(true)
        setCaller(data.from)
        setName(data.name)
        setCallerSignal(data.signal)
    })

  }, [])

  return (
    <div className="App">
     
    </div>
  );
}

export default App;
