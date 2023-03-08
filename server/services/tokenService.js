const pool = require('../pool')
const jwt = require('jsonwebtoken')
const userService = require('./userService')

class TokenService {
    constructor() {
        this.verifyToken = this.verifyToken.bind(this)
    }
    generateTokens(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30m' })
        const refreshPayload = { "userid": payload.userid, "tokentype": "refresh" }
        const refreshToken = jwt.sign(refreshPayload, process.env.JWT_ACCESS_SECRET, { expiresIn: '30d' })
        const tokens = { accessToken, refreshToken }
        try {
            this.storeTokens(payload.userid, tokens)
        } catch (error) {
            return error
        }
        return tokens
    }
    async verifyToken(access_token, user_id) {
        try {
            const checkUsersToken = 'SELECT * FROM public.tokens WHERE user_id = $1'
            const result = (await pool.query(checkUsersToken, [user_id]))
            const { rowCount } = result
            if (rowCount !== 0) {
                const trueToken = result.rows[0].access_token
                if (trueToken === access_token) {
                    const userData = await userService.fetchUserDto(user_id);
                    try {
                        const jwtVerification = jwt.verify(access_token, process.env.JWT_ACCESS_SECRET);
                    } catch (error) {
                        if (error instanceof jwt.TokenExpiredError) {
                            const { userDto } = userData
                            try {
                                const newTokens = this.generateTokens({ ...userDto });
                                const newAccessToken = newTokens.accessToken
                                return { status: 201, message: 'Token has been regenerated', access_token:newAccessToken }
                            } catch (error) {
                                return { status: 500, message: 'Unknown token error' }
                            }
                        } else if (error instanceof jwt.JsonWebTokenError) {
                            return { status: 496, message: 'Invalid token' }
                        } else {
                            return { status: 500, message: 'Unknown token error' }
                        }
                    }
                    const { userPublic } = userData
                    return { status: 200, message: 'Token validity confirmed', user: userPublic, access_token }
                } else {
                    return { status: 401, message: 'User unauthorized' }
                }
            } else {
                return { status: 401, message: 'User unauthorized' }
            }
        } catch (error) {
            return { status: 500, message: error.message }
        }
    }
    async storeTokens(userid, tokens) {
        const checkTokensQuery = 'SELECT * FROM public.tokens WHERE user_id = $1'
        const ifTokenExists = await pool.query(checkTokensQuery, [userid])
        let exeQuery
        if (ifTokenExists.rowCount === 0) { exeQuery = 'INSERT INTO public.tokens (access_token, refresh_token, user_id ) VALUES ($1,$2,$3)' }
        else { exeQuery = 'UPDATE public.tokens SET access_token = $1, refresh_token = $2 WHERE user_id = $3' }
        try {
            await pool.query(exeQuery, [tokens.accessToken, tokens.refreshToken, userid])
        } catch (error) {
            console.log(error)
            return { status: 500, message: 'Server Error' }
        }
    }
    async deleteToken(req, res) {
        const { user_id } = req.body;
        const deleteTokensQuery = 'DELETE FROM public.tokens WHERE user_id = $1';
        try {
            await pool.query(deleteTokensQuery, [user_id]);
            return res.status(200).json({ message: 'Tokens deleted successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Server Error' });
        }
    }
}
module.exports = new TokenService()