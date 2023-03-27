const pool = require('../pool')
const UserDto = require('../dtos/userDto')

class ChatService {
    async joinRoom(credits) {
        const { user_id, chat_id } = credits;
        const memberCheckQuery = 'SELECT COUNT(*) FROM public.roommate WHERE user_user_id = $1 AND chat_room_chatid = $2;'
        let dbres
        try {
            dbres = await pool.query(memberCheckQuery, [user_id, chat_id])
        } catch (error) {
            return (error)
        }
        const isMember = parseInt(dbres.rows[0].count)
        if (isMember === 1) {
            const lastHundred = await this.fetchHistory(chat_id, 0)
            return { status: 200, message: 'Vsio zaebis', history: lastHundred }
        } else {
            return { status: 500, message: 'You are not member of this chat...' }
        }
    }
    async fetchHistory(chat_id, startPoint) {
        const fetchLastHundred = 'SELECT * FROM public.message WHERE chat_room_chatid = $1 ORDER BY event_timestamp DESC OFFSET $2 LIMIT 100;'
        let res
        try {
            res = await pool.query(fetchLastHundred, [chat_id, startPoint])
            if (res.rowCount > 0) {
                return { message: `100 messages from position: ${startPoint} fetched`, data: res.rows }
            } else {
                return { message: `Chat history is clear` }
            }
        } catch (error) {
            console.log(error)
            return { message: 'DB ERROR' }
        }
    }
}
module.exports = new ChatService()