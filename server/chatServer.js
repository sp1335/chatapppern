const http = require('http')
const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
app.use(cookieParser())
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

const composeInfoMessage = (data) => {
    return {messageType:'infomessage',message: data}
}
const composeMessage = (message,id) => {
    return {messageType:'usermessage',message: message, id:id}
}
io.on('connection', (socket) => {
    socket.on('existing', (ID) => {
        socket.emit('loggedin', 'Welcome back')
        socket.broadcast.emit('message', composeInfoMessage(`User #${ID} connected`))
    })
    socket.on('login', () => {
        const userID = socket.id
        socket.emit('socketID', userID)
        socket.broadcast.emit('message', composeInfoMessage(`User #${userID} connected`))
    })
    socket.on('message',(data)=>{
        const messageObject = composeMessage(data[0], data[1])
        console.log(messageObject)
        io.emit('message', messageObject)
    })
})

server.listen(8080, () => {
    console.log(`Server running on port 8080`)
})