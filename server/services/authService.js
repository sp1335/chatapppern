const pool = require('../pool')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')

class AuthService {
    async signup(username, password, email) {
        const checkQuery = 'SELECT COUNT(*) FROM public.user WHERE email = $1 OR name = $2'
        try {
            const { count } = (await pool.query(checkQuery, [email, username])).rows[0]
            if (count > 0) {
                return { status: 409, message: 'User with this email or name already exists' }
            } else {
                const userid = uuidv4()
                const insertQuery = 'INSERT INTO public.user (user_id, name, email, password, role, photo_url, creation_date, last_activity) VALUES ($1,$2,$3,$4,4,1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
                await pool.query(insertQuery, [userid, username, email, password])
                const userDto = new UserDto([email, userid, 4]);
                const tokens = tokenService.generateTokens({ ...userDto })
                return { status: 200, message: 'Signed up succesfully!', tokens, userDto: { ...userDto } }
            }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }
    async signin(username, password) {
        const checkQuery = 'SELECT * FROM public.user WHERE name = $1'
        try {
            const { rows: [user] } = await pool.query(checkQuery, [username])
            if (!user) return { status: 401, message: 'No user with this name found' }
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                const userDto = new UserDto([user.email, user.user_id, user.role])
                const tokens = tokenService.generateTokens({ ...userDto })
                return { status: 200, message: 'Signed in succesfully!', tokens, userDto: { ...userDto } }
            } else {
                return { status: 401, message: 'Wrong password' }
            }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }
    async signout(access_token) {
        const deleteQuery = 'DELETE FROM public.tokens WHERE access_token = $1';
        try {
            await pool.query(deleteQuery,[access_token])
        } catch (error) {
            return {status: 500, message: error.message}
        }
        return {status: 200, message:'Token removed'}
    }
}

module.exports = new AuthService()