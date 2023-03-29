const tokenService = require('../services/tokenService')
const chatService = require('../services/chatService')

const composeInfoMessage = (data) => {
    return { messageType: 'infomessage', message: data }
}
const composeMessage = (message, id) => {
    return { messageType: 'usermessage', message: message, id: id }
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
                    console.log('Chat history: ', membership, ";")
                    socket.emit('history', { history: membership.history })
                } else if (membership.status === 500) {
                    console.log('Not member of this chat')
                } else {
                    console.log(membership)
                }
            }
        })
        socket.on('message', (data) => {
            const messageObject = composeMessage(data[0], data[1])
            console.log(messageObject)
            io.emit('message', messageObject)
        })
    })
}