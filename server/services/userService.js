const { Pool } = require('pg')
const UserDto = require('../dtos/userDto')
const DB_CREDITS_PARSED = JSON.parse(process.env.DB_CREDITS)
const tokenService = require('./tokenService')

class UserService {
    async fetchUserRoomlist(req, res) {
        const cookies = (req.headers.cookie)
        const access_token = (cookies.split(';')[0]).split('=')[1]
        // const user_id = cookies.split(';')[1].split('=')[1]
        // console.log(tokenService)
        // try {
        //     const tokenState = await tokenService.verifyToken({cookie:{access_token,user_id}},res)
        //     console.log(tokenState)
        // } catch (error) {
        //     console.log(error)
        // }
    }
    async fetchUserDto(userid) {
        const pool = new Pool(DB_CREDITS_PARSED)
        if (userid !== '') {
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
        } else { return { status: 401, message: 'Invalide UUID' } }

    }
}
module.exports = new UserService()