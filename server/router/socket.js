const tokenService = require('../services/tokenService')
const chatService = require('../services/chatService')

const composeInfoMessage = (data) => {
    return { messageType: 'infomessage', message: data }
}
const composeMessage = (message, id, timestamp) => {
    return { messageType: 'usermessage', message: message, id: id, timestamp: timestamp }
}
module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', async (credits) => {
            const { token, user_id, chat_id } = credits;
            const tokenValidity = await tokenService.verifyToken(token, user_id)
            if (tokenValidity.status !== 200) {
                socket.emit('join_error', { message: 'Token validity error' })
                return;
            } else {
                const membership = await chatService.joinRoom({ user_id, chat_id })
                if (membership.status === 200) {
                    socket.emit('history', { history: membership.history })
                } else if (membership.status === 500) {
                    console.log('Not member of this chat')
                } else {
                    console.log(membership)
                }
            }
        })
        socket.on('message', async (data) => {
            const { token, user_id, message, chat_id } = data
            const tokenValidity = await tokenService.verifyToken(token, user_id)
            if (tokenValidity.status !== 200) {
                socket.emit('join_error', { message: 'Token validity error' })
                return;
            } else {
                const postMessage = await chatService.postMessage({ user_id, chat_id, message })
                if (postMessage.status === 200) {
                    const { timestamp, message, user_id } = postMessage.data
                    io.emit('newMessage', composeMessage(message, user_id, timestamp))
                }
            }
            // io.emit('message', messageObject)
        })
    })
}