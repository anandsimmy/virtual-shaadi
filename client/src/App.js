import React, { useState, useEffect, useRef } from 'react'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import AssignmentIcon from '@material-ui/icons/Assignment'
import PhoneIcon from '@material-ui/icons/Phone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import './App.css';

const socket= io.connect('http://localhost:5000')

const App= () => {

  const [me, setMe]= useState('')
  const [name, setName]= useState('')
  const [idToCall, setIdToCall]= useState('')
  const [stream, setStream]= useState('')
  const [caller, setCaller]= useState('')
  const [callEnded, setCallEnded]= useState('')
  const [callAccepted, setCallAccepted]= useState('')
  const [receivingCall, setReceivingCall]= useState('')
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

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller })
    })

    peer.on('stream', (stream) => {
      userVideo.current.srcObject=stream
    })

    peer.signal(callerSignal)
    connectionRef.current= peer

  }

  const leaveCall= () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }

  return (
    <div className="App">
      <div className="video-container">
        <div className="video">
          {
            stream && <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />
          }
        </div>
        <div className="video">
          {
            (callAccepted && !callEnded) && <video playsInline muted ref={userVideo} autoPlay style={{ width: '300px' }} />
          }
        </div>
      </div>
      
      <div className="my-id">
        <TextField id="filled-basic" label="Name" variant="filled" value={name}
          onChange={e => setName(e.target.value)} style={{marginBottom: "2rem"}} />
        <CopyToClipboard text={me} style={{marginBottom: "2rem"}} >
          <Button variant="contained" color="primary" startIcon={<AssignmentIcon fontSize="large" />}>
            Copy ID
          </Button>
        </CopyToClipboard>
        <TextField id="filled-basic" label="ID to call" variant="filled" value={idToCall}
          onChange={e => setIdToCall(e.target.value)} style={{marginBottom: "2rem"}} />
      </div>
      
      <div className="call-button">
        {
          callAccepted && !callEnded ? (
            <Button variant="contained" color="secondary" onClick={leaveCall}>
              End call
            </Button>
          ) : (
            <IconButton color="primary" onClick={() => callUser(idToCall)}>
              <PhoneIcon fontSize="large" />
            </IconButton>
          )
        }
        {idToCall}
      </div>
      
      <div className="answer-call">
        {
          (receivingCall && !callAccepted) && (
            <>
              <h1>{name} is calling...</h1>
              <Button variant="contained" color="primary" onClick={answerCall}>
                Answer
              </Button>
            </>
          )
        }
      </div>
    </div>
  );
}

export default App;
