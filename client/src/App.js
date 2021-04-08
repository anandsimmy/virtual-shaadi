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
  const [callAccepted, setCallAccepted]= useState('')
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

  const callUser= (id) => {
    const peer= new Peer({
      initiator: true,
      trickle: false,
      stream: stream
    })

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name: name
      })
    })

    peer.on('stream', (stream) => {
      userVideo.current.srcObject= stream
    })


    socket.on('callAccepted', (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current= peer

  }

  const answerCall= () => {
    setCallAccepted(true)
    const peer= new Peer({
      initiator: false,
      trickle: false,
      stream: stream
    })

    // peer.on('signal', (data) => {
    //   socket.emit('answerCall', { signal: data, to: caller })
    // })

  }

  return (
    <div className="App">
     
    </div>
  );
}

export default App;
