const pool = require('../pool')
const UserDto = require('../dtos/userDto')

class UserService {
    async fetchUserRoomlist(user_id) {
        const query = 'SELECT chat_id, chat_name, date_creation, last_modified FROM public.chat_room WHERE chat_id IN (SELECT chat_room_chatid FROM public.roommate WHERE user_user_id = $1)';
        const contactQuery = 'SELECT contact_userid FROM public.contact WHERE user_user_id = $1'
        try {
            const roomsList = (await pool.query(query,[user_id])).rows
            if(roomsList.length===0) return { status: 404, message: 'User participate in no rooms' }
            return { status: 200, rooms:roomsList }
        } catch (error) {
            return error;
        }
    }
    async fetchUserDto(userid) {
        const fetchUserQuery = 'SELECT * FROM public.user WHERE user_id = $1'
        try {
            const userData = (await pool.query(fetchUserQuery, [userid])).rows[0]
            const userDto = new UserDto([userData.email, userData.user_id, userData.role])
            const { user_id, name, email, photo_url } = userData
            const publicData = { user_id, name, email, photo_url }
            return { userDto: userDto, userPublic: publicData }
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = new UserService()