require('dotenv').config()
const cors = require('cors')

const router = require('./router/index')
const express = require('express')
const cookieParser = require('cookie-parser')
const port = process.env.API_PORT
const app = express()

const http = require('http')
const server = http.createServer(app)
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
    }
})

app.use(express.json())
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
app.use(cookieParser())
app.use('/api', router)

app.use((res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Credentials", true);
});

const startServer = () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening at port ${port}`)
        })
        require('./router/socket')(io);
    } catch (error) {
        console.log(error)
    }
}
startServer()