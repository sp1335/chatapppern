const { Client } = require('pg')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const tokenService = require('./tokenService')
const UserDto = require('../dtos/userDto')
const ApiError = require('../exception/apiError')
const DB_CREDITS_PARSED = JSON.parse(process.env.DB_CREDITS)

class AuthService {
    async signup(req, res, next) {
        const { name, password, email } = req.body
        const client = new Client(DB_CREDITS_PARSED)
        try {
            const checkQuery = 'SELECT COUNT(*) FROM public.user WHERE email = $1 OR name = $2'
            await client.connect()
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
                const userDto = new UserDto([email, userid, 4]);
                const tokens = tokenService.generateTokens({ ...userDto })
                res.status(200).json({ status: 'Signed up succesfully;', "Access token": tokens.accessToken })
            }
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors });
        } finally {
            client.end()
        }
    }
    async signin(req, res, next) {
        const { name, password } = req.body
        const client = new Client(DB_CREDITS_PARSED)
        try {
            const checkQuery = 'SELECT * FROM public.user WHERE name = $1'
            await client.connect()
            const user = (await client.query(checkQuery, [name])).rows[0]
            const isMatch = await bcrypt.compare(password, user.password)
            if (isMatch) {
                try {
                    const userDto = new UserDto([user.email,user.user_id,user.role])
                    const tokens = tokenService.generateTokens({...userDto})
                    res.status(200).json({"Access token":tokens.accessToken})
                } catch (error) {
                    console.log(error)
                }
            } else {
                throw new ApiError(403, `Password doesn't match`)
            }
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message, errors: error.errors });
        } finally {
            client.end
        }
    }
    async logout(refreshToken) {
        //logout logic
    }
    async refresh(refreshToken) {
        //refresh logic
    }
}

module.exports = new AuthService()