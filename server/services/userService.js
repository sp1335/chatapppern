const pool = require('../pool')
const UserDto = require('../dtos/userDto')

class UserService {
    async fetchUserRoomlist(req, res) {
        const cookies = (req.headers.cookie)
        const access_token = (cookies.split(';')[0]).split('=')[1]
        const user_id = cookies.split(';')[1].split('=')[1]
        // console.log(tokenService)
        // try {
        //     const tokenState = await tokenService.verifyToken({cookie:{access_token,user_id}},res)
        //     console.log(tokenState)
        // } catch (error) {
        //     console.log(error)
        // }
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