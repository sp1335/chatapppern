const { Client } = require('pg')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exception/apiError')
const DB_CREDITS_PARSED = JSON.parse(process.env.DB_CREDITS)

class UserSevice {
    async signup(req, res, next) {
        const { name, password, email } = req.body
        const client = new Client(DB_CREDITS_PARSED)
        try {
            client.connect()
            const checkQuery = 'SELECT COUNT(*) FROM public.user WHERE email = $1 OR name = $2'
            const candidate = await client.query(checkQuery, [email, name])
            const candidateCheck = candidate.rows[0].count
            if (candidateCheck > 0) {
                throw new ApiError(409, "User with this email or name already exists.")
            } else {
                const userid = uuidv4()
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(password, salt)
                const insertQuery = 'INSERT INTO public.user (user_id, name, email, password, role, photo_url, creation_date, last_activity) VALUES ($1,$2,$3,$4,4,1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)'
                await client.query(insertQuery, [userid, name, email, hashedPassword])
                const userDto = new UserDto([email,userid,4]);
                console.log(userDto)
                const tokens = tokenService.generateTokens({...userDto})
                await tokenService.saveToken(userDto.id, tokens.refreshToken)
                res.status(200).json('Registered succesfully: tokens incoming')
            }
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors });
        } finally {
            client.end()
        }
    }
    async signin(req, res, next) {
        try {
            res.send('signin')
        } catch (error) {
            console.log(error)
        }
    }
    async getUser(req, res, next) {
        try {
            console.log(req)
            res.send('getUser')
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports = new UserSevice()