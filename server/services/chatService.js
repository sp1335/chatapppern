const pool = require('../pool')
const UserDto = require('../dtos/userDto')
const uuid = require('uuid')
class ChatService {
    async postMessage(credits) {
        const { user_id, chat_id, message } = credits
        const postMessageQuery = `INSERT INTO public.message
        (message_type, message_body, event_timestamp, url, chat_room_chatid, roommate_user_user_id)
        VALUES 
        ('usermessage',$1,$2,$3,$4,$5)`
        let dbres
        const timestamp = new Date(Date.now()).toISOString();
        try {
            dbres = await pool.query(postMessageQuery, [message, timestamp, '', chat_id, user_id])
            return { status: 200, data: { timestamp: timestamp, message, user_id } }
        } catch (error) {
            return (error)
        }
    }
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
            return { status: 200, message: 'Success', history: lastHundred }
        } else {
            return { status: 500, message: 'You are not member of this chat...' }
        }
    }
    async fetchHistory(chat_id, startPoint) {
        // const fetchLastHundred = 'SELECT * FROM public.message WHERE chat_room_chatid = $1 ORDER BY event_timestamp DESC OFFSET $2 LIMIT 15;'
        const fetchLastHundred = `SELECT message.*, "user"."name" as user_name
        FROM public.message message
        JOIN public."user" "user" ON message.roommate_user_user_id = "user".user_id
        WHERE message.chat_room_chatid = $1
        ORDER BY message.event_timestamp DESC
        OFFSET $2
        LIMIT 15;`
        const fetchChatInfo = 'SELECT * FROM public.chat_room WHERE chat_id = $1'
        const fetchRommmatesInfo = 'SELECT roommate.roommate_role, roommate.user_user_id FROM public.chat_room JOIN public.roommate ON chat_room.chat_id = roommate.chat_room_chatid WHERE chat_room.chat_id = $1';
        try {
            const res = await pool.query(fetchLastHundred, [chat_id, startPoint])
            const resChat = await pool.query(fetchChatInfo, [chat_id])
            const resUsers = await pool.query(fetchRommmatesInfo, [chat_id])
            if (res.rowCount > 0) {
                return { message: `100 messages from position: ${startPoint} fetched`, data: res.rows, chat_info: resChat.rows[0], chat_members: resUsers.rows }
            } else {
                return { message: `Chat history is clear`, chat_info: resChat.rows[0] }
            }
        } catch (error) {
            console.log(error)
            return { message: 'DB ERROR' }
        }
    }
}
module.exports = new ChatService()