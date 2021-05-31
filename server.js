const express= require('express')
const app= express()
const server= require('http').createServer(app)

const io= require('socket.io')(server, { 
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    socket.emit('me', socket.id)

    socket.on('callEnded', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('oneUserCalling', {
            signal: data.signal,
            from: data.from,
            name: data.name
        })
    })

    socket.on('callAccepted', (data) => {
        io.to(data.to).emit('callAccepted', {
            signal: data.signal,
            from: data.from,
        })
    })

})

server.listen(5000, () => {
    console.log('Listening on port 5000')
})