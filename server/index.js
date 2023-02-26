require('dotenv').config()
const cors = require('cors')
const router = require('./router/index')
const express = require('express')
const server = express()
const port = process.env.API_PORT
server.use(express.json())
server.use(cors({ credentials: true, origin: process.env.CLIENT_URL }))
server.use('/api', router)
server.use((res) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
    res.header('Access-Control-Allow-Credentials', 'true');
})
const startServer = () => {
    try {
        server.listen(port, () => {
            console.log(`Server is listening at port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()