const express= require('express')
const app= express()
const server= require('http').Server(app)

const io= require('socket.io')(server, { 
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})


io.on('connection', socket => {

    socket.emit('me', socket.id)

    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded')
    })

    socket.on('callUser', (data) => {

        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from,
            name: data.name
        })

    })
})

server.listen(5000, 'Server running on port 5000')